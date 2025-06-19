import axios from "axios";

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: "http://localhost:3000/api", // URL de tu backend
  timeout: 10000, // 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar el token de autenticación si lo tienes
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo global de errores
    if (error.response?.status === 401) {
      // Token expirado o no válido
      localStorage.removeItem("token");
      // Redirigir al login si es necesario
    }

    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
