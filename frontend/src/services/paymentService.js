import api from './api';

export const paymentService = {
  /**
   * Initiate payment: Sends OrderID to backend to generate the MD5 hash
   * and retrieve all necessary PayHere parameters.
   */
  initiatePayment: async (orderId) => {
    try {
      const res = await api.post('/payments/initiate', { orderId });
      return res.data?.data || res.data;
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  },

  /**
   * Verify and complete payment: Called on return from PayHere
   * Updates Payment → Completed and Order → Processing
   */
  verifyAndComplete: async (orderId) => {
    try {
      const res = await api.post('/payments/verify', { orderId });
      return res.data?.data || res.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  },

  /**
   * Get payment status: Used on the Return page to read
   * the updated status after verifyAndComplete runs.
   */
  getPaymentStatus: async (orderId) => {
    try {
      const res = await api.get(`/payments/status/${orderId}`);
      return res.data?.data || res.data;
    } catch (error) {
      console.error('Error fetching payment status:', error);
      throw error;
    }
  },
};