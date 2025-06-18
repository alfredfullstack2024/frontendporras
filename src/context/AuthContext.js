import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Recuperar usuario si existe en localStorage
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser({ token, rol: "anonymous" }); // Usuario anónimo por defecto
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Lógica de login simulada para el perfil "123"
    if (email === "123" && password === "123") {
      const newUser = { token: "public-token-123", rol: "public" };
      localStorage.setItem("token", newUser.token);
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
