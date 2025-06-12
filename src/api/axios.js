src/api/axios.js:import axios from "axios";

// Configura la URL base del backend usando la variable de entorno o un valor por defecto
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://admin-gimnasios-backend.onrender.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});
console.log("Base URL del API configurada:", api.defaults.baseURL);

// Forzar que la URL base use localhost en desarrollo
if (process.env.NODE_ENV === "development") {
  api.defaults.baseURL = "http://localhost:5000/api";
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token añadido a la solicitud:", token);
    } else {
      console.log("No se encontró token en localStorage.");
    }
    console.log("Solicitud enviada a:", `${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("Error en el interceptor de solicitud:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Sesión expirada, redirigiendo a login...");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(new Error("Sesión expirada. Por favor, inicia sesión nuevamente."));
    }
    if (error.response?.status === 403) {
      return Promise.reject(new Error("No tienes permisos para realizar esta acción."));
    }
    if (error.response?.status === 404) {
      return Promise.reject(new Error("Recurso no encontrado. Verifica la ruta o los datos enviados."));
    }
    if (!error.response) {
      return Promise.reject(new Error("Error de conexión. Por favor, verifica tu conexión a internet."));
    }
    const errorMessage = error.response?.data?.mensaje || error.response?.data?.message || "Error desconocido";
    const statusCode = error.response?.status || "desconocido";
    console.error("Error en la respuesta del servidor:", { statusCode, errorMessage, data: error.response?.data });
    return Promise.reject(new Error(`Error ${statusCode}: ${errorMessage}`));
  }
);

export const obtenerEntrenadorPorId = (id, config) => api.get(`/entrenadores/${id}`, config);
export const editarEntrenador = (id, data, config) => api.put(`/entrenadores/${id}`, data, config);
export const crearEntrenador = (data, config) => api.post("/entrenadores", data, config);
export const obtenerEntrenadores = (config) => api.get("/entrenadores", config);
export const eliminarEntrenador = (id, config) => api.delete(`/entrenadores/${id}`, config);

// Nueva función para obtener todas las clases de los entrenadores
export const obtenerClases = async (config) => {
  const response = await api.get("/entrenadores", config);
  const clases = response.data.flatMap((entrenador) => 
    (entrenador.clases || []).map(clase => ({
      ...clase,
      _id: `${entrenador._id}-${clase.nombreClase}`, // Generar un ID único para la clase
      entrenador: { nombre: entrenador.nombre, apellido: entrenador.apellido }
    }))
  );
  return { data: clases };
};

// Nueva función para eliminar una clase (actualiza el entrenador correspondiente)
export const eliminarClase = async (id, config) => {
  const [entrenadorId, nombreClase] = id.split('-');
  const response = await api.get(`/entrenadores/${entrenadorId}`, config);
  const entrenador = response.data;
  const nuevasClases = (entrenador.clases || []).filter(clase => clase.nombreClase !== nombreClase);
  await api.put(`/entrenadores/${entrenadorId}`, { ...entrenador, clases: nuevasClases }, config);
};

