export const env = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "https://mini.alwaysdata.net/api/v1",
  APP_ID: import.meta.env.VITE_APP_ID || "1",
  SECRET_KEY: import.meta.env.VITE_SECRET_KEY || "",
  STORAGE_BASE_URL:
    import.meta.env.VITE_STORAGE_BASE_URL ||
    "https://mini.alwaysdata.net/storage",
} as const;

export const isDev = import.meta.env.DEV;
export const isProd = import.meta.env.PROD;
