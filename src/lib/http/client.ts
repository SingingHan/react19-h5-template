import axios, { AxiosError, AxiosHeaders } from 'axios';
import type { ApiRequestConfig } from './types';
import { integrationConfig } from '@/config/integration';
import { getAccessToken, getRefreshToken, useUserStore } from '@/stores/user';

interface ApiEnvelope<T> {
  code: number;
  message: string;
  data: T;
}

interface RefreshPayload {
  token: string;
  refreshToken?: string;
}

const timeout = Number(import.meta.env.VITE_API_TIMEOUT || 15000);
const defaultRetry = Number(import.meta.env.VITE_API_RETRY || 0);
const defaultRetryDelay = Number(import.meta.env.VITE_API_RETRY_DELAY || 300);
// 刷新 token 的接口路径，可按环境覆盖
const refreshPath = import.meta.env.VITE_API_REFRESH_PATH || '/auth/refresh';

// 记录进行中的请求，用于重复请求取消
const pendingRequestMap = new Map<string, AbortController>();
const idempotentMethods = new Set(['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE']);

// 保证同一时刻只发一个 refresh 请求，其他 401 请求等待同一个 Promise
let refreshTokenPromise: Promise<string> | null = null;

function serialize(value: unknown) {
  if (typeof value === 'string') {
    return value;
  }

  try {
    return JSON.stringify(value ?? {});
  } catch {
    return String(value);
  }
}

function getRequestKey(config: ApiRequestConfig) {
  const method = (config.method || 'GET').toUpperCase();
  const url = config.url || '';
  return [method, url, serialize(config.params), serialize(config.data)].join('&');
}

function shouldDedupe(config: ApiRequestConfig) {
  if (typeof config.dedupe === 'boolean') {
    return config.dedupe;
  }

  // 默认只对 GET 去重，避免误伤写操作
  return (config.method || 'GET').toUpperCase() === 'GET';
}

function cancelPendingRequest(config: ApiRequestConfig) {
  if (!shouldDedupe(config) || !config.url) {
    return;
  }

  const key = getRequestKey(config);
  const pendingController = pendingRequestMap.get(key);

  if (pendingController) {
    pendingController.abort('Canceled duplicated request');
    pendingRequestMap.delete(key);
  }
}

function trackPendingRequest(config: ApiRequestConfig) {
  if (!shouldDedupe(config) || !config.url || config.signal) {
    return;
  }

  const key = getRequestKey(config);
  cancelPendingRequest(config);

  const controller = new AbortController();
  config.signal = controller.signal;
  pendingRequestMap.set(key, controller);
}

function clearPendingRequest(config?: ApiRequestConfig) {
  if (!config || !shouldDedupe(config) || !config.url) {
    return;
  }

  pendingRequestMap.delete(getRequestKey(config));
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function unwrapPayload<T>(payload: ApiEnvelope<T> | T): T {
  if (payload && typeof payload === 'object' && 'code' in payload) {
    const normalized = payload as ApiEnvelope<T>;
    if (normalized.code !== integrationConfig.successCode) {
      throw new Error(normalized.message || 'Request failed');
    }
    return normalized.data;
  }

  return payload as T;
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('Missing refresh token');
  }

  // refresh 走独立 axios，避免和业务实例互相拦截
  const response = await axios.post<ApiEnvelope<RefreshPayload> | RefreshPayload>(
    refreshPath,
    { [integrationConfig.refreshTokenField]: refreshToken },
    {
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  const nextAuth = unwrapPayload(response.data);

  if (!nextAuth.token) {
    throw new Error('Invalid refresh response');
  }

  useUserStore.getState().setAuth({
    token: nextAuth.token,
    refreshToken: nextAuth.refreshToken ?? refreshToken
  });

  return nextAuth.token;
}

async function queueRefreshToken() {
  if (!refreshTokenPromise) {
    refreshTokenPromise = refreshAccessToken().finally(() => {
      refreshTokenPromise = null;
    });
  }

  return refreshTokenPromise;
}

function shouldHandleUnauthorized(error: AxiosError, config?: ApiRequestConfig) {
  return (
    error.response?.status === 401 &&
    !!config &&
    !config.skipAuth &&
    !config.skipAuthRefresh &&
    !config._retryAuth
  );
}

function shouldRetry(error: AxiosError, config?: ApiRequestConfig) {
  if (!config) {
    return false;
  }

  const retries = typeof config.retry === 'number' ? config.retry : defaultRetry;

  if (retries <= 0) {
    return false;
  }

  const retryCount = config._retryCount || 0;

  if (retryCount >= retries) {
    return false;
  }

  const method = (config.method || 'GET').toUpperCase();

  // 仅允许幂等请求重试
  if (!idempotentMethods.has(method)) {
    return false;
  }

  if (error.code === 'ERR_CANCELED') {
    return false;
  }

  const status = error.response?.status;

  if (status === 401 || status === 403) {
    return false;
  }

  if (typeof status === 'number') {
    return status >= 500 || status === 429;
  }

  return true;
}

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout,
  headers: {
    'Content-Type': 'application/json'
  }
});

httpClient.interceptors.request.use((rawConfig) => {
  const config = rawConfig as ApiRequestConfig;

  trackPendingRequest(config);

  if (!config.skipAuth) {
    const token = getAccessToken() || localStorage.getItem('access_token');

    if (token) {
      if (config.headers instanceof AxiosHeaders) {
        config.headers.set(
          integrationConfig.tokenHeaderKey,
          `${integrationConfig.tokenPrefix}${token}`
        );
      } else {
        config.headers = {
          ...config.headers,
          [integrationConfig.tokenHeaderKey]: `${integrationConfig.tokenPrefix}${token}`
        };
      }
    }
  }

  return rawConfig;
});

const onResponseFulfilled: any = (response: any) => {
  clearPendingRequest(response.config as ApiRequestConfig);
  return unwrapPayload(response.data as ApiEnvelope<unknown> | unknown);
};

httpClient.interceptors.response.use(
  onResponseFulfilled,
  async (error: AxiosError<{ message?: string }>) => {
    const config = error.config as ApiRequestConfig | undefined;

    clearPendingRequest(config);

    // 401: 先刷新 token，再重放原请求
    if (shouldHandleUnauthorized(error, config)) {
      try {
        const nextToken = await queueRefreshToken();

        if (!config) {
          throw new Error('Missing request config');
        }

        config._retryAuth = true;
        config.signal = undefined;

        if (config.headers instanceof AxiosHeaders) {
          config.headers.set(
            integrationConfig.tokenHeaderKey,
            `${integrationConfig.tokenPrefix}${nextToken}`
          );
        } else {
          config.headers = {
            ...config.headers,
            [integrationConfig.tokenHeaderKey]: `${integrationConfig.tokenPrefix}${nextToken}`
          };
        }

        return httpClient(config);
      } catch (refreshError) {
        useUserStore.getState().clearUser();
        return Promise.reject(refreshError instanceof Error ? refreshError : new Error('Login expired'));
      }
    }

    if (shouldRetry(error, config)) {
      if (!config) {
        return Promise.reject(new Error('Missing request config'));
      }

      config._retryCount = (config._retryCount || 0) + 1;
      config.signal = undefined;

      const baseDelay =
        typeof config.retryDelay === 'number' ? config.retryDelay : defaultRetryDelay;

      await delay(baseDelay * config._retryCount);
      return httpClient(config);
    }

    if (error.code === 'ERR_CANCELED') {
      return Promise.reject(new Error('Request canceled'));
    }

    const message = error.response?.data?.message || error.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);
