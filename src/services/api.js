import axios from "axios";

// Detectar si está en desarrollo o producción
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

// URL base condicional
const baseURL = isDevelopment 
  ? "http://localhost:3000/api"  // Local
  : "https://backendorchidgym.onrender.com/api"; // Producción

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL,
  timeout: 60000, // 60 segundos
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
