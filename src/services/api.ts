import axios from "axios";
import Constants from "expo-constants";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl || "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available (future)
    // const token = getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
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
