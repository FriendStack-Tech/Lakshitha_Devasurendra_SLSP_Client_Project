import api from './api';

export const shippingService = {
  getAllShipments: (params = {}) => api.get('/shipping', { params }),
  getShippingByOrder: (orderId) => api.get(`/shipping/order/${orderId}`),
  updateShippingStatus: (id, payload) => api.put(`/shipping/${id}/status`, payload),
};