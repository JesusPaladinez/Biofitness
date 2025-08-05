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

  // Exportar membresías a Excel
  exportToExcel: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.searchTerm) {
        params.append('searchTerm', filters.searchTerm);
      }
      if (filters.selectedState && filters.selectedState !== 'todos') {
        params.append('selectedState', filters.selectedState);
      }
      if (filters.selectedPlan && filters.selectedPlan !== 'todos') {
        params.append('selectedPlan', filters.selectedPlan);
      }
      
      const response = await api.get(`/memberships/export?${params.toString()}`, {
        responseType: 'blob'
      });
      
      // Verificar que la respuesta sea válida
      if (!response.data || response.data.size === 0) {
        throw new Error('El archivo Excel está vacío o no se pudo generar');
      }
      
      // Crear blob y descargar directamente
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Generar el nombre del archivo con fecha y hora actual
      const now = new Date();
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      
      const fileName = `Biofitness Membresías ${day}-${month}-${year} ${hours}-${minutes}.xlsx`;
      
      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      throw new Error('Error al descargar el archivo Excel. Por favor, inténtalo de nuevo.');
    }
  },
};
