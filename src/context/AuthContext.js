import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("Token configurado en headers:", token);
      // Opción: podría validar el token con una ruta /me o /profile
    } else {
      delete api.defaults.headers.common["Authorization"];
      console.log("No hay token para configurar en headers");
    }
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/login", { email, password });
      const token = response.data.token;
      if (!token) throw new Error("No se recibió un token.");

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const userData = response.data.user || {};
      const rol = userData.rol || userData.role || "user";
      setUser({ ...userData, rol, token });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      throw new Error(error.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const register = async (nombre, email, password, rol) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/register", { nombre, email, password, role: rol });
      const token = response.data.token;
      if (!token) throw new Error("No se recibió un token.");

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const userData = response.data.user || {};
      const userRol = userData.rol || userData.role || rol || "user";
      setUser({ ...userData, rol: userRol, token });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
      throw new Error(error.response?.data?.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  const hasPermission = (requiredRole) => {
    if (!user) return false;
    if (user.rol === "admin") return true;
    return user.rol === requiredRole;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  return context;
};

export { AuthContext, AuthProvider, useAuth };
