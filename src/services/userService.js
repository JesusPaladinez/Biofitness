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

  getById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
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

  // Buscar usuarios por nombre
  searchByName: async (name) => {
    try {
      const response = await api.get(
        `/users/search?name=${encodeURIComponent(name)}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
