import api from '../api/client'
import { useAuthStore } from '@/stores/authStore'

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

export const setupTokenRefreshInterceptor = () => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (
          originalRequest.url?.includes('/auth/login') ||
          originalRequest.url?.includes('/auth/refresh') ||
          originalRequest.url?.includes('/auth/logout')
        ) {
          return Promise.reject(error)
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then(() => api(originalRequest))
            .catch((err) => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const refreshResponse = await api.get("/auth/refresh")
          if (!refreshResponse.data.success) {
            throw new Error("Refresh failed")
          }
          processQueue(null)
          return api(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError)
          // Clear user from store on refresh failure
          useAuthStore.getState().clearUser()
          if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
            window.location.href = "/login"
          }
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }
      
      return Promise.reject(error)
    }
  )
}