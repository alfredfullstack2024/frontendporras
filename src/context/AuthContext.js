import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarUsuario = async () => {
      if (!token) {
        setCargando(false);
        return;
      }

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/usuarios/perfil`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsuario(data);
      } catch (error) {
        console.error("Error cargando usuario:", error.response?.data?.msg || error.message);
        setUsuario(null);
      } finally {
        setCargando(false);
      }
    };

    cargarUsuario();
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/usuarios/login`, {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUsuario(data.usuario);
      return { success: true };
    } catch (error) {
      console.error("Error al iniciar sesión:", error.response?.data?.msg || error.message);
      return { success: false, msg: error.response?.data?.msg || "Error al iniciar sesión" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        setUsuario,
        token,
        setToken,
        cargando,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
