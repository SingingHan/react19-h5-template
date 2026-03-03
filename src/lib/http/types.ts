import type { AxiosRequestConfig } from 'axios';

export interface ApiRequestConfig extends AxiosRequestConfig {
  // true: 当前请求不自动带 token
  skipAuth?: boolean;
  // true: 401 后不走自动刷新 token
  skipAuthRefresh?: boolean;
  // true: 启用重复请求取消（默认 GET 启用）
  dedupe?: boolean;
  // 当前请求重试次数（覆盖全局配置）
  retry?: number;
  // 当前请求重试间隔（ms，覆盖全局配置）
  retryDelay?: number;
  // 内部字段：已重试次数
  _retryCount?: number;
  // 内部字段：是否已经走过一次 401 重放
  _retryAuth?: boolean;
}
