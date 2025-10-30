import axios from 'axios'
import VueAxios from 'vue-axios'

// Create axios instance with config
const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle errors globally
    return Promise.reject(error)
  },
)

export { instance as axios, VueAxios }
