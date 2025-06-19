import api from "./api";

export const planService = {
  getAll: async () => {
    try {
      const response = await api.get("/plans");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/plans/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (planData) => {
    try {
      const response = await api.post("/plans", planData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, planData) => {
    try {
      const response = await api.put(`/plans/${id}`, planData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/plans/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
