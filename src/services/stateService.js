import api from "./api";

export const stateService = {
  getAll: async () => {
    try {
      const response = await api.get("/states");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/states/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (stateData) => {
    try {
      const response = await api.post("/states", stateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, stateData) => {
    try {
      const response = await api.put(`/states/${id}`, stateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/states/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
