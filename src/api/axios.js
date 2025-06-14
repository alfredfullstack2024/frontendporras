import axios from "axios";

// Función para obtener y validar la URL base del backend
const getBaseUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL;
  const defaultDevUrl = "http://localhost:5000/api";
  const defaultProdUrl = "https://admin-gimnasios-backend.onrender.com/api";
  const baseUrl = envUrl || (process.env.NODE_ENV === "development" ? defaultDevUrl : defaultProdUrl);

  console.log("Depuración de URL - Variables de entorno:", {
    REACT_APP_API_URL: envUrl,
    NODE_ENV: process.env.NODE_ENV,
    BaseUrlSeleccionada: baseUrl,
  });

  // Validar que la URL sea accesible (opcional, ajusta si no tienes /status)
  const testUrl = `${baseUrl}/status`; // Ajusta si no existe este endpoint
  axios
    .get(testUrl, { timeout: 5000 })
    .then(() => console.log("URL base válida y accesible:", baseUrl))
    .catch((error) => {
      console.error("Error al validar la URL base:", {
        url: baseUrl,
        error: error.message,
        code: error.code,
      });
      if (!envUrl) {
        console.warn("REACT_APP_API_URL no está definida. Usando URL por defecto:", defaultProdUrl);
      }
    });

  return baseUrl;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
});
console.log("Base URL del API configurada finalmente:", api.defaults.baseURL);

// Interceptor de solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token añadido a la solicitud:", {
        token: token.substring(0, 10) + "...", // Mostrar solo parte por seguridad
        url: `${config.baseURL}${config.url}`,
      });
    } else {
      console.log("No se encontró token en localStorage. Solicitud sin autenticación a:", `${config.baseURL}${config.url}`);
    }
    console.log("Solicitud enviada a:", {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("Error en el interceptor de solicitud:", {
      message: error.message,
      code: error.code,
      config: error.config,
    });
    return Promise.reject(error);
  }
);

// Interceptor de respuestas
api.interceptors.response.use(
  (response) => {
    console.log("Respuesta recibida:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Timeout en la solicitud:", {
        message: error.message,
        url: error.config?.url,
        timeout: error.config?.timeout,
      });
      return Promise.reject(new Error("La solicitud tardó demasiado. Verifica tu conexión."));
    }
    if (error.response) {
      console.error("Error en la respuesta:", {
        status: error.response.status,
        url: error.response.config.url,
        data: error.response.data,
        headers: error.response.headers,
      });
      if (error.response.status === 401) {
        console.error("Sesión expirada, redirigiendo a login... URL:", error.response.config.url);
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(new Error("Sesión expirada. Por favor, inicia sesión nuevamente."));
      }
      if (error.response.status === 403) {
        return Promise.reject(new Error("No tienes permisos para realizar esta acción."));
      }
      if (error.response.status === 404) {
        return Promise.reject(new Error("Recurso no encontrado. Verifica la ruta o los datos enviados."));
      }
    } else if (!error.response) {
      console.error("Error de conexión:", {
        message: error.message,
        url: error.config?.url,
      });
      return Promise.reject(new Error("Error de conexión. Verifica tu conexión a internet."));
    }
    const errorMessage =
      error.response?.data?.mensaje ||
      error.response?.data?.message ||
      "Error desconocido";
    const statusCode = error.response?.status || "desconocido";
    console.error("Error en la respuesta del servidor:", {
      statusCode,
      errorMessage,
      url: error.response?.config?.url,
      data: error.response?.data,
    });
    return Promise.reject(new Error(`Error ${statusCode}: ${errorMessage}`));
  }
);

// Funciones exportadas para entrenadores
export const obtenerEntrenadorPorId = (id) => api.get(`/entrenadores/${id}`);
export const editarEntrenador = (id, data) => api.put(`/entrenadores/${id}`, data);
export const crearEntrenador = (data) => api.post("/entrenadores", data);
export const obtenerEntrenadores = () => api.get("/entrenadores");
export const eliminarEntrenador = (id) => api.delete(`/entrenadores/${id}`);

// Funciones para clases
export const obtenerClasesDisponibles = () => api.get("/clases/disponibles");
export const registrarClienteEnClase = (data) => api.post("/clases/registrar", data);
export const consultarClasesPorNumeroIdentificacion = (numeroIdentificacion) =>
  api.get(`/clases/consultar/${numeroIdentificacion}`);

export const obtenerClases = async () => {
  const response = await api.get("/entrenadores");
  const clases = response.data.flatMap((entrenador) =>
    (entrenador.clases || []).map((clase) => ({
      ...clase,
      _id: `${entrenador._id}-${clase.nombreClase}`,
      entrenador: { nombre: entrenador.nombre, apellido: entrenador.apellido },
    }))
  );
  console.log("Clases extraídas:", clases);
  return { data: clases };
};

export const eliminarClase = async (id) => {
  const [entrenadorId, nombreClase] = id.split("-");
  const response = await api.get(`/entrenadores/${entrenadorId}`);
  const entrenador = response.data;
  const nuevasClases = (entrenador.clases || []).filter(
    (clase) => clase.nombreClase !== nombreClase
  );
  console.log("Eliminando clase - Nuevas clases:", nuevasClases);
  await api.put(`/entrenadores/${entrenadorId}`, { ...entrenador, clases: nuevasClases });
};

export default api;
