import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Don't redirect if we're already on auth pages or if this is an auth endpoint
        const currentPath = window.location.pathname;
        const isAuthPage =
          currentPath === "/login" || currentPath === "/register";
        const isAuthEndpoint = error.config?.url?.includes("/auth/");

        // Only redirect if we're not on an auth page and this isn't an auth endpoint
        if (!isAuthPage && !isAuthEndpoint) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          // Delay the redirect slightly to avoid race conditions
          setTimeout(() => {
            window.location.href = "/login";
          }, 100);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
