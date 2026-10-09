/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OBS_HOST?: string;
  readonly VITE_OBS_PORT?: string;
  readonly VITE_OBS_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
