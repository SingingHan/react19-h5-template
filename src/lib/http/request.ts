import { httpClient } from './client';
import type { ApiRequestConfig } from './types';

export function get<T>(url: string, config?: ApiRequestConfig): Promise<T> {
  return httpClient.get<unknown, T>(url, config);
}

export function post<T, B = unknown>(
  url: string,
  body?: B,
  config?: ApiRequestConfig
): Promise<T> {
  return httpClient.post<unknown, T, B>(url, body, config);
}

export function put<T, B = unknown>(
  url: string,
  body?: B,
  config?: ApiRequestConfig
): Promise<T> {
  return httpClient.put<unknown, T, B>(url, body, config);
}

export function del<T>(url: string, config?: ApiRequestConfig): Promise<T> {
  return httpClient.delete<unknown, T>(url, config);
}
