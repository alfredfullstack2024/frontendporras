import axios from "axios";

// Configura la URL base del backend dinámicamente
const getBaseUrl = () => {
  return process.env.REACT_APP_API_URL || (process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : "https://admin-gimnasios-backend.onrender.com/api");
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
});
console.log("Base URL del API configurada:", api.defaults.baseURL);

// Interceptor de solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token añadido a la solicitud:", token);
    } else {
      console.log("No se encontró token en localStorage. Solicitud sin autenticación.");
    }
    console.log("Solicitud enviada a:", `${config.baseURL}${config.url}`, "con datos:", config.data);
    return config;
  },
  (error) => {
    console.error("Error en el interceptor de solicitud:", error.message, error);
    return Promise.reject(error);
  }
);

// Interceptor de respuestas
api.interceptors.response.use(
  (response) => {
    console.log("Respuesta recibida:", response.status, response.data);
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Timeout en la solicitud:", error.message);
      return Promise.reject(new Error("La solicitud tardó demasiado. Verifica tu conexión."));
    }
    if (error.response) {
      console.error("Error en la respuesta:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
      if (error.response.status === 401) {
        console.error("Sesión expirada, redirigiendo a login...");
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
      console.error("Error de conexión:", error.message);
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

// Funciones para clases (puedes mantenerlas o ajustarlas según necesidad)
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
  return { data: clases };
};

export const eliminarClase = async (id) => {
  const [entrenadorId, nombreClase] = id.split("-");
  const response = await api.get(`/entrenadores/${entrenadorId}`);
  const entrenador = response.data;
  const nuevasClases = (entrenador.clases || []).filter(
    (clase) => clase.nombreClase !== nombreClase
  );
  await api.put(`/entrenadores/${entrenadorId}`, { ...entrenador, clases: nuevasClases });
};

export default api;
