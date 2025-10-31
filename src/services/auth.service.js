import { axios } from '@/plugins/axios'

/**
 * Register new user
 * @param {Object} data - { name, email, password }
 * @returns {Promise}
 */
export async function register(data) {
  try {
    const response = await axios.post('/api/auth/register', data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Login user
 * @param {Object} data - { email, password }
 * @returns {Promise}
 */
export async function login(data) {
  try {
    const response = await axios.post('/api/auth/login', data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Verify email with token
 * @param {string} token - Verification token from email
 * @returns {Promise}
 */
export async function verifyEmail(token) {
  try {
    const response = await axios.post('/api/auth/verify', { token })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Resend verification email
 * @param {string} email - User email
 * @returns {Promise}
 */
export async function resendVerification(email) {
  try {
    const response = await axios.post('/api/auth/resend-verification', { email })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise}
 */
export async function refreshToken(refreshToken) {
  try {
    const response = await axios.post('/api/auth/refresh', { refreshToken })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Logout user
 * @param {string} refreshToken - Refresh token
 * @returns {Promise}
 */
export async function logout(refreshToken) {
  try {
    const response = await axios.post('/api/auth/logout', { refreshToken })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}
