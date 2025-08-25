import axios from "axios";

// URL base desde variable de entorno (Vite usa prefijo VITE_)
const baseURL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL;

// Validar que la variable de entorno esté definida
if (!baseURL) {
  throw new Error('VITE_API_BASE_URL debe estar definida en las variables de entorno');
}

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
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses con retry automático
api.interceptors.response.use(
  (response) => {

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
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) return true;
  
  try {

    await healthCheck();

    return true;
  } catch (error) {

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

        // Aquí podrías agregar una notificación toast si tienes una librería
      }
      throw error;
    } finally {
      onLoadingChange?.(false);
    }
  },
};

export default api;