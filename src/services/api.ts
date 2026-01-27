import axios from "axios";
import Constants from "expo-constants";
import { camelizeKeys, decamelizeKeys } from "humps";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl || "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - transforms camelCase to snake_case for backend
api.interceptors.request.use(
  (config) => {
    // Add auth token if available (future)
    // const token = getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

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
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      if (status === 401) {
        // Handle unauthorized (future: redirect to login)
        console.log("Unauthorized - session expired");
      }

      // Return structured error
      return Promise.reject({
        status,
        code: data?.code || "UNKNOWN_ERROR",
        message: data?.message || "An unexpected error occurred",
        details: data?.details,
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
