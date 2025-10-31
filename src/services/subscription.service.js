import { axios } from '@/plugins/axios'

/**
 * Get user subscription
 * @returns {Promise} Promise with subscription data
 */
export async function getSubscription() {
  try {
    const response = await axios.get('/api/subscriptions')
    return response.data
  } catch (error) {
    console.error('Error fetching subscription:', error)
    throw error.response?.data || error
  }
}
