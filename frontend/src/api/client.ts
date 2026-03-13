import axios from 'axios'

import { PATHS } from '@/lib/constants'

import { API_ENDPOINTS } from './endpoints'

// Get API URL from env or default
export const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

export const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Track if we're currently refreshing to avoid multiple refresh requests
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const AUTH_BEARER_EXCLUDED_ENDPOINTS = [API_ENDPOINTS.auth.google, API_ENDPOINTS.auth.refresh]

const shouldSkipAuthHeader = (url?: string) => {
  if (!url) return false

  return AUTH_BEARER_EXCLUDED_ENDPOINTS.some((endpoint) => url === endpoint || url.endsWith(endpoint))
}

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })

  failedQueue = []
}

// Request interceptor: Attach token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token && !shouldSkipAuthHeader(config.url)) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor: Handle errors and token refresh
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (!originalRequest) {
      return Promise.reject(error)
    }

    if (error.response) {
      // Handle 401 Unauthorized - Try to refresh token
      if (error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then(() => {
              originalRequest._retry = true

              const accessToken = localStorage.getItem('accessToken')
              if (accessToken) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`
              }

              return client(originalRequest)
            })
            .catch((err) => {
              return Promise.reject(err)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          // Try to refresh using httpOnly cookie session
          const response = await axios.post(
            `${API_URL}${API_ENDPOINTS.auth.refresh}`,
            {},
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )

          const { accessToken } = response.data.data

          // Update stored token
          localStorage.setItem('accessToken', accessToken)

          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`

          // Process queued requests
          processQueue(null)
          isRefreshing = false

          // Retry the original request
          return client(originalRequest)
        } catch (refreshError) {
          // Only force logout if refresh token is actually invalid/unauthorized.
          // For temporary network/server issues, keep local auth state to avoid unnecessary sign-outs.
          processQueue(new Error('Token refresh failed'))
          isRefreshing = false

          if (axios.isAxiosError(refreshError) && refreshError.response?.status === 401) {
            redirectToLogin()
          }

          return Promise.reject(refreshError)
        }
      }
    }

    return Promise.reject(error)
  },
)

function redirectToLogin() {
  // Clear all auth data
  localStorage.removeItem('accessToken')
  localStorage.removeItem('auth-storage')

  // Redirect to login page if not already there
  if (!window.location.pathname.includes(PATHS.LOGIN)) {
    window.location.href = PATHS.LOGIN
  }
}
