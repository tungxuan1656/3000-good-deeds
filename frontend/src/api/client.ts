import axios from 'axios'

import { authTokenStorage } from '@/lib/auth-tokens'
import { PATHS } from '@/lib/constants'

import type { ApiResponse, RefreshTokenResponse } from '../types/api'
import { API_ENDPOINTS } from './endpoints'

// Get API URL from env or default
export const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

export const client = axios.create({
  baseURL: API_URL,
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

  return AUTH_BEARER_EXCLUDED_ENDPOINTS.some(
    (endpoint) => url === endpoint || url.endsWith(endpoint),
  )
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
    const token = authTokenStorage.getAccessToken()
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            originalRequest._retry = true

            const accessToken = authTokenStorage.getAccessToken()
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
        const refreshToken = authTokenStorage.getRefreshToken()

        if (!refreshToken) {
          throw new Error('Missing refresh token')
        }

        const response = await axios.post<ApiResponse<RefreshTokenResponse>>(
          `${API_URL}${API_ENDPOINTS.auth.refresh}`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        const { accessToken, refreshToken: nextRefreshToken } = response.data.data

        authTokenStorage.setTokens({
          accessToken,
          refreshToken: nextRefreshToken,
        })

        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        processQueue(null)
        isRefreshing = false

        return client(originalRequest)
      } catch (refreshError) {
        processQueue(new Error('Token refresh failed'))
        isRefreshing = false
        redirectToLogin()

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

function redirectToLogin() {
  authTokenStorage.clear()
  localStorage.removeItem('auth-storage')

  if (!window.location.pathname.includes(PATHS.LOGIN)) {
    window.location.href = PATHS.LOGIN
  }
}
