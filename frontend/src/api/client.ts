import axios from 'axios'

// Get API URL from env or default
const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

export const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: Attach token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor: Handle errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // Clear token and redirect to login
        // Important: Use window.location to ensure full reload and state reset
        // Prevent infinite loop if already on login page
        if (!window.location.pathname.includes('/login')) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          // window.location.href = '/login'; // Uncomment when login route exists
        }
      }
    }

    return Promise.reject(error)
  },
)
