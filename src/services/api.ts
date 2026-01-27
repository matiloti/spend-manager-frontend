import axios, { InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { camelizeKeys, decamelizeKeys } from "humps";
import { useAuthStore } from "@/stores/authStore";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl || "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
];

// Check if endpoint is public
function isPublicEndpoint(url: string | undefined): boolean {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

// Request interceptor - transforms camelCase to snake_case and adds auth
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add auth token if available and endpoint requires auth
    if (!isPublicEndpoint(config.url)) {
      const authStore = useAuthStore.getState();

      // Check if we need to refresh the token
      if (authStore.isAuthenticated && authStore.shouldRefreshToken()) {
        // Don't refresh if we're already calling refresh endpoint
        if (!config.url?.includes("/auth/refresh")) {
          const success = await authStore.refreshAccessToken();
          if (!success) {
            // Token refresh failed, clear auth
            await authStore.clearAuth();
          }
        }
      }

      // Get current access token after potential refresh
      const accessToken = useAuthStore.getState().accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    // Transform request body from camelCase to snake_case
    if (config.data) {
      config.data = decamelizeKeys(config.data);
    }

    // Transform query params from camelCase to snake_case
    if (config.params) {
      config.params = decamelizeKeys(config.params);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - transforms snake_case to camelCase for frontend
api.interceptors.response.use(
  (response) => {
    // Transform response data from snake_case to camelCase
    if (response.data) {
      response.data = camelizeKeys(response.data);
    }
    return response;
  },
  async (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data, config } = error.response;

      // Handle 401 errors - potential session expiry
      if (status === 401 && !isPublicEndpoint(config.url)) {
        const authStore = useAuthStore.getState();
        const errorCode = data?.error?.code || data?.code;

        // If token reuse detected or refresh token invalid, clear auth
        if (
          errorCode === "TOKEN_REUSE_DETECTED" ||
          errorCode === "INVALID_REFRESH_TOKEN" ||
          errorCode === "TOKEN_EXPIRED"
        ) {
          console.log("Auth token invalid - clearing session");
          await authStore.clearAuth();
        }
      }

      // Transform error data from snake_case to camelCase
      const errorData = data ? camelizeKeys(data) : {};

      // Handle nested error structure from backend
      const errorObj = (errorData as { error?: { code?: string; message?: string; details?: unknown[] } }).error || errorData;

      // Return structured error
      return Promise.reject({
        status,
        code: (errorObj as { code?: string }).code || "UNKNOWN_ERROR",
        message: (errorObj as { message?: string }).message || "An unexpected error occurred",
        details: (errorObj as { details?: unknown[] }).details,
      });
    } else if (error.request) {
      // Network error
      return Promise.reject({
        status: 0,
        code: "NETWORK_ERROR",
        message: "Unable to connect to the server",
      });
    }

    return Promise.reject(error);
  }
);

export default api;
