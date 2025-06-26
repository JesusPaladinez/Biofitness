import api from "./api";

export const userService = {
  getAll: async () => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener todos los usuarios con membresía activa
  getAllWithActiveMemberships: async () => {
    try {
      const response = await api.get("/users/with-memberships/active");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener usuario por ID con membresía activa
  getByIdWithActiveMembership: async (id) => {
    try {
      const response = await api.get(`/users/${id}/with-membership`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener todas las membresías de un usuario
  getMembershipsByUser: async (id) => {
    try {
      const response = await api.get(`/users/${id}/memberships`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (userData) => {
    try {
      const response = await api.post("/users", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear usuario con membresía en una sola transacción
  createUserWithMembership: async (userData) => {
    try {
      const response = await api.post('/users/with-membership', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
