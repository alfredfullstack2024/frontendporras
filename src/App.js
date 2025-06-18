import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";
import PrivateRoute from "./components/PrivateRoute";

// Páginas Públicas
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ConsultaUsuario from "./pages/ConsultaUsuario";
import ConsultarRutina from "./pages/ConsultarRutina";
import ConsultarComposicionCorporal from "./pages/ConsultarComposicionCorporal";
import VideosEntrenamiento from "./pages/videos/VideosEntrenamiento";

// Componente para proteger rutas basadas en roles
const PublicRoute = ({ element, allowedRole }) => {
  const { user } = useAuth();

  if (!user || user.rol !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

const App = () => {
  return (
    <Routes>
      {/* Rutas Públicas (fuera de PrivateRoute) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/consulta-usuario" element={<ConsultaUsuario />} />
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* Rutas Protegidas para el usuario public-user */}
      <Route element={<PrivateRoute />}>
        <Route
          path="/rutinas/consultar"
          element={<PublicRoute element={<ConsultarRutina />} allowedRole="public-user" />}
        />
        <Route
          path="/consultar-composicion-corporal"
          element={<PublicRoute element={<ConsultarComposicionCorporal />} allowedRole="public-user" />}
        />
        <Route
          path="/videos-entrenamiento"
          element={<PublicRoute element={<VideosEntrenamiento />} allowedRole="public-user" />}
        />
      </Route>

      {/* Ruta 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
