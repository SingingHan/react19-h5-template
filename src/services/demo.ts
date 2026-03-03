import { get } from '@/lib/http/request';

export interface ServerInfo {
  env: string;
  time: string;
}

export function getServerInfoSimple() {
  return get<ServerInfo>('/system/info');
}

export function getServerInfoByQuery() {
  return getServerInfoSimple();
}
