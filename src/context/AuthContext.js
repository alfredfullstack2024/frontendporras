// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          console.log("Validando token existente...");
          const response = await api.get("/auth/validate-token"); // Añadir endpoint si existe
          const userData = response.data.user || {};
          const rol = userData.rol || userData.role || "user";
          setUser({ ...userData, rol, token });
        } catch (error) {
          console.error("Token inválido, limpiando...", error.message);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/login", credentials);
      console.log("Respuesta de /auth/login:", response.data);
      const token = response.data.token;
      if (!token) throw new Error("No se recibió un token.");
      localStorage.setItem("token", token);
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
      console.log("Respuesta de /auth/register:", response.data);
      const token = response.data.token;
      if (!token) throw new Error("No se recibió un token.");
      localStorage.setItem("token", token);
      const userData = response.data.user || {};
      const userRol = userData.rol || userData.role || rol || "user";
      setUser({ ...userData, rol: userRol, token });
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
    navigate("/login");
  };

  const hasPermission = (requiredRole) => {
    if (!user) return false;
    console.log("Rol del usuario:", user.rol, "Rol requerido:", requiredRole);
    if (user.rol === "admin") return true;
    return user.rol === requiredRole;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, hasPermission }}>
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
