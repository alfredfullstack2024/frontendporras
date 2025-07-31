import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ← importante: evitar renderizado prematuro
  const navigate = useNavigate();
  const location = useLocation();

  // Verifica si el usuario ya está autenticado
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Opcional: podrías traer el usuario desde el backend si lo deseas
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData) setUser(userData);
    } else {
      delete api.defaults.headers.common["Authorization"];
    }

    setLoading(false); // ← terminamos la carga inicial
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const token = response.data.token;
      const userData = response.data.user || {};

      if (!token) throw new Error("No se recibió un token.");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      const rol = userData.rol || userData.role || "user";
      setUser({ ...userData, rol, token });

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      throw new Error(error.response?.data?.message || "Error al iniciar sesión");
    }
  };

  const register = async (nombre, email, password, rol) => {
    try {
      const response = await api.post("/auth/register", { nombre, email, password, role: rol });
      const token = response.data.token;
      const userData = response.data.user || {};

      if (!token) throw new Error("No se recibió un token.");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      const userRol = userData.rol || userData.role || rol || "user";
      setUser({ ...userData, rol: userRol, token });

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
      throw new Error(error.response?.data?.message || "Error al registrar usuario");
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
    navigate("/login");
  }, [navigate]);

  const hasPermission = (requiredRole) => {
    if (!user) return false;
    const userRol = user.rol || user.role || "user";
    if (userRol === "admin") return true;
    return userRol === requiredRole;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, hasPermission }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  return context;
};

export { AuthProvider, useAuth };

