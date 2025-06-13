import api from "../api/client";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

let isRefreshing = false;

type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
};

let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
};

export const setupTokenRefreshInterceptor = () => {
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      // If this is not an Axios error, just reject it
      if (!error.config) {
        return Promise.reject(error);
      }

      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (
          originalRequest.url?.includes("/auth/login") ||
          originalRequest.url?.includes("/auth/refresh") ||
          originalRequest.url?.includes("/auth/logout")
        ) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => api(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshResponse = await api.get<{ success: boolean }>("/auth/refresh");
          if (!refreshResponse.data.success) {
            throw new Error("Refresh failed");
          }

          processQueue(null);
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
