import api from "./api";

export const membershipService = {
  // Obtener todas las membresías con detalles
  getAllWithDetails: async () => {
    try {
      const response = await api.get("/memberships");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener solo membresías activas (Vigente y Por vencer)
  getActive: async () => {
    try {
      const response = await api.get("/memberships/active/list");
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

  // El endpoint para actualizar estados de todas las membresías
  updateAllStates: async () => {
    try {
      const response = await api.put("/memberships/update-states/all");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
