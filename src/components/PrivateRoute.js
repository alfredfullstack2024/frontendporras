import { useContext, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = () => {
  const { user, loading, setUser } = useContext(AuthContext);
  const location = useLocation();

  // Validar token al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      console.log(
        "Token encontrado, pero usuario no está seteado. Validando..."
      );
      setUser({ token }); // Esto depende de cómo manejes el usuario en AuthContext
    }
  }, [user, setUser]);

  console.log("PrivateRoute - Estado:", { user, loading, currentPath: location.pathname }); // Depuración

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h4 className="text-muted">Cargando... 🌀</h4>
      </div>
    );
  }

  // Rutas públicas que no requieren autenticación
  const publicRoutes = [
    "/login",
    "/register",
    "/consulta-usuario",
    "/rutinas/consultar",
    "/consultar-composicion-corporal",
    "/videos-entrenamiento",
  ];

  if (publicRoutes.includes(location.pathname)) {
    console.log("Ruta pública detectada, permitiendo acceso:", location.pathname);
    return <Outlet />; // Permite el acceso sin autenticación para rutas públicas
  }

  if (!user) {
    console.log("Usuario no autenticado, redirigiendo a /login desde ruta privada");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Renderiza las rutas hijas para rutas protegidas
};

export default PrivateRoute;
