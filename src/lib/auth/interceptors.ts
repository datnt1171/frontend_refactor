import api from '../api/client'
import { getCurrentLocale, getAcceptLanguage } from '../utils/locale'

// Request interceptor for Accept-Language
api.interceptors.request.use(
  (config) => {
    const locale = getCurrentLocale()
    config.headers['Accept-Language'] = getAcceptLanguage(locale)

    // Set JSON Content-Type ONLY if not sending FormData
    if (
      !(config.data instanceof FormData) &&
      !config.headers['Content-Type'] // allow custom override
    ) {
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  (error) => Promise.reject(error)
)