import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { env } from "../config/env";
import { authManager } from "../services/authManager";

// Tạo axios instance
const createHttpClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: env.API_BASE_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return client;
};

export const httpClient = createHttpClient();

export const setAuthToken = (token: string | null) => {
  // Deprecated - use authManager instead
};

export const getAuthToken = () => {
  return authManager.getToken() || "";
};

// Request interceptor - gắn token nếu có
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Gắn token nếu có sẵn
    const token = authManager.getToken();
    if (token && authManager.isTokenValid()) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Gắn X-App-Id cho tất cả request
    config.headers["X-App-Id"] = env.APP_ID;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý errors với auto-refresh token
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const { response, config } = error;

    if (response?.status === 401 && config) {
      console.error("Token expired");
    } else if (response?.status === 422) {
      // Validation errors - log chi tiết
      console.error("Validation errors:", response.data);
    } else if (response?.status === 429) {
      // Rate limiting
      console.warn("Rate limited - request will be retried");
    } else if (response?.status && response.status >= 500) {
      // Server errors
      console.error("Server error:", response.status, response.data);
    }

    return Promise.reject(error);
  }
);

export default httpClient;
