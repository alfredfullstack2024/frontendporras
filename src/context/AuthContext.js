// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate se usa directamente dentro del componente o hook

import api from "../api/axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Se inicializa en true, indicando que aún estamos verificando
  const navigate = useNavigate(); // useNavigate se llama directamente aquí

  // Este useEffect se encarga de configurar el token en los headers de axios
  // cada vez que el 'user' cambia (es decir, después de login/register/logout)
  useEffect(() => {
    const token = user?.token || localStorage.getItem("token"); // Preferimos el token del objeto user si existe
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("Token configurado en headers:", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      console.log("No hay token para configurar en headers (o se eliminó)");
    }
  }, [user]); // Depende de 'user' para re-ejecutar cuando el usuario cambia

  // Este useEffect se ejecuta una sola vez al montar el componente
  // para verificar si hay un token existente y autenticar al usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token en localStorage al iniciar:", token);

    if (token) {
      api
        .get("/auth/me")
        .then((response) => {
          console.log("Datos de /auth/me:", response.data);
          const usuario = response.data.user;
          if (usuario) {
            setUser({ ...usuario, token }); // Incluimos el token en el objeto de usuario
          } else {
            console.warn("No se recibió un usuario válido.");
            setUser(null);
            localStorage.removeItem("token"); // Si no hay usuario válido, eliminamos el token
          }
          setLoading(false); // La carga inicial ha terminado
        })
        .catch((error) => {
          console.error("Error en /auth/me:", error.message);
          localStorage.removeItem("token");
          setUser(null);
          setLoading(false); // La carga inicial ha terminado, incluso si hubo un error
        });
    } else {
      console.log("No hay token, usuario no autenticado.");
      setLoading(false); // No hay token, entonces la carga inicial ha terminado
    }
  }, []); // El array de dependencias vacío significa que se ejecuta solo una vez al montar

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      console.log("Respuesta de /auth/login:", response.data);
      const token = response.data.token;
      const usuario = response.data.user;
      if (!token || !usuario) {
        throw new Error("No se recibió un token o usuario válido.");
      }
      localStorage.setItem("token", token);
      setUser({ ...usuario, token }); // Guardamos el usuario y su token
      // api.defaults.headers.common["Authorization"] se actualizará por el otro useEffect
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      throw new Error(
        error.response?.data?.message || "Error al iniciar sesión"
      );
    }
  };

  const register = async (nombre, email, password, rol) => {
    try {
      const response = await api.post("/auth/register", {
        nombre,
        email,
        password,
        role: rol,
      });
      console.log("Respuesta de /auth/register:", response.data);
      const token = response.data.token;
      const usuario = response.data.user;
      if (!token || !usuario) {
        throw new Error("No se recibió un token o usuario válido.");
      }
      localStorage.setItem("token", token);
      setUser({ ...usuario, token }); // Guardamos el usuario y su token
      // api.defaults.headers.common["Authorization"] se actualizará por el otro useEffect
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
      throw new Error(
        error.response?.data?.message || "Error al registrar usuario"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    // delete api.defaults.headers.common["Authorization"] se actualizará por el otro useEffect
    navigate("/login");
  };

  const hasPermission = (requiredRole) => {
    // Si loading es true, o user es null, no tiene permisos por ahora.
    if (loading || !user) return false;

    console.log("Rol del usuario:", user.role, "Rol requerido:", requiredRole);
    if (user.role === "admin") return true;
    return user.role === requiredRole;
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };
