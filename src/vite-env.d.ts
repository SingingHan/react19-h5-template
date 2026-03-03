/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_API_RETRY: string;
  readonly VITE_API_RETRY_DELAY: string;
  readonly VITE_API_REFRESH_PATH: string;
  readonly VITE_PROXY_PREFIX?: string;
  readonly VITE_PROXY_TARGET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
