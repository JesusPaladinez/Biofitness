import axios from "axios";

// Detectar si está en desarrollo o producción
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

// URL base condicional
const baseURL = isDevelopment 
  ? "http://localhost:3000/api"  
  : "https://backendorchidgym.onrender.com/api"; 

// Crear instancia de axios con configuración optimizada
const api = axios.create({
  baseURL,
  timeout: 90000, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Usar el token de manager guardado en localStorage
    const token = localStorage.getItem("managerToken");
    if (token && !config.skipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log para debugging (solo en desarrollo)
    if (isDevelopment) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses con retry automático
api.interceptors.response.use(
  (response) => {
    // Log para debugging (solo en desarrollo)
    if (isDevelopment) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Retry lógica para timeouts y errores de servidor
    if (
      !originalRequest._isRetry &&
      (error.code === 'ECONNABORTED' || 
       error.response?.status >= 500 ||
       !error.response) &&
      originalRequest._retryCount < 2
    ) {
      originalRequest._isRetry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      console.log(`🔄 Reintentando request (${originalRequest._retryCount}/2): ${originalRequest.url}`);
      
      // Esperar antes del retry (backoff exponencial)
      const delay = originalRequest._retryCount * 2000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return api(originalRequest);
    }

    // Manejo de errores 401 (token expirado)
    if (error.response?.status === 401) {
      console.warn("🔐 Token expirado o inválido");
      localStorage.removeItem("managerToken");
      
      // Solo redirigir si no estamos ya en login
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }

    // Log de errores
    console.error("❌ API Error:", {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });

    return Promise.reject(error);
  }
);

// Health check para warm-up
export const healthCheck = () => api.get('/health-check', { skipAuth: true, timeout: 30000 });

// Función para hacer warm-up del backend
export const warmupBackend = async () => {
  if (isDevelopment) return true;
  
  try {
    console.log("🔥 Haciendo warm-up del backend...");
    await healthCheck();
    console.log("✅ Backend listo!");
    return true;
  } catch (error) {
    console.warn("⚠️ Warm-up falló:", error.message);
    return false;
  }
};

// Wrapper para requests con loading automático
export const apiWithLoading = {
  async request(requestFn, options = {}) {
    const { onLoadingChange, showError = true } = options;
    
    try {
      onLoadingChange?.(true);
      const response = await requestFn();
      return response;
    } catch (error) {
      if (showError) {
        console.error('Request failed:', error);
        // Aquí podrías agregar una notificación toast si tienes una librería
      }
      throw error;
    } finally {
      onLoadingChange?.(false);
    }
  },
};

export default api;