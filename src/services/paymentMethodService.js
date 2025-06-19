import api from "./api";

export const paymentMethodService = {
  getAll: async () => {
    try {
      const response = await api.get("/payment-methods");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/payment-methods/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (paymentMethod) => {
    try {
      const response = await api.post("/payment-methods", paymentMethod);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, paymentMethod) => {
    try {
      const response = await api.put(`/payment-methods/${id}`, paymentMethod);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/payment-methods/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
