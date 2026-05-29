// services/apiClient.ts
// FIX: Was duplicated (services/apiClient.ts vs utils/apiClient.ts).
// FIX: Hardcoded "http://localhost:3000/api" replaced with env variable.
// This is now the ONE axios instance used by all services.

import axios from "axios";
import { env } from "@/lib/env";
import { ROUTES } from "@/lib/constants";

const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token from localStorage on every request (client-side only)
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Global response error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = ROUTES.adminLogin;
    }
    return Promise.reject(error);
  }
);

export default apiClient;
