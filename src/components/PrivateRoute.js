import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  const location = useLocation();

  // Rutas públicas que no requieren autenticación
  const publicRoutes = [
    "/login",
    "/register",
    "/consulta-usuario",
    "/rutinas/consultar",
    "/consultar-composicion-corporal",
    "/videos-entrenamiento",
  ];

  console.log("PrivateRoute - Ruta actual:", location.pathname); // Depuración

  // Si la ruta es pública, permite el acceso
  if (publicRoutes.includes(location.pathname)) {
    console.log(`Ruta pública detectada: ${location.pathname}, permitiendo acceso`);
    return <Outlet />;
  }

  // Para rutas protegidas, redirige si no hay token
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("Sin token, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Renderiza las rutas hijas para rutas protegidas
};

export default PrivateRoute;
