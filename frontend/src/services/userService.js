import api from './api';

export const userService = {
  /* ───── ADDRESSES ───── */

  getAddresses: async () => {
    const res = await api.get('/addresses');
    // Backend returns: { success, count, data: [...] }
    return res.data.data ?? [];
  },

  getDefaultAddress: async () => {
    const res = await api.get('/addresses/default');
    // Backend returns: { success, data: {...} }
    return res.data.data ?? null;
  },

  addAddress: async (data) => {
    const res = await api.post('/addresses', data);
    return res.data;
  },

  updateAddress: async (id, data) => {
    const res = await api.put(`/addresses/${id}`, data);
    return res.data;
  },

  setDefaultAddress: async (id) => {
    const res = await api.patch(`/addresses/${id}/set-default`);
    return res.data;
  },

  deleteAddress: async (id) => {
    const res = await api.delete(`/addresses/${id}`);
    return res.data;
  }
};