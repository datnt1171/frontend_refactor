// Setup interceptors
import '../auth/interceptors'
import { setupTokenRefreshInterceptor } from '../auth/refresh'

// Initialize token refresh interceptor
setupTokenRefreshInterceptor()

// Export all API functions
export * from './auth'
export * from './users'
export * from './processes'
export * from './tasks'

// Export client for direct use if needed
export { default as api } from './client'