import api from "./api";

export const membershipService = {
  getAllWithDetails: async () => {
    try {
      const response = await api.get("/memberships");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/memberships/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (membershipData) => {
    try {
      const response = await api.post("/memberships", membershipData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, membershipData) => {
    try {
      const response = await api.put(`/memberships/${id}`, membershipData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/memberships/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener membresías por usuario
  getByUser: async (userId) => {
    try {
      const response = await api.get(`/memberships/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener membresías vencidas
  getExpired: async () => {
    try {
      const response = await api.get("/memberships/expired");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
