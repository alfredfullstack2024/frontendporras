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

// Páginas Protegidas
import Dashboard from "./pages/Dashboard";
import Suscripcion from "./pages/Suscripcion";

// Clientes
import ListaClientes from "./pages/ListaClientes";
import CrearCliente from "./pages/CrearCliente";
import EditarCliente from "./pages/EditarCliente";

// Membresías
import Membresias from "./pages/Membresias";
import CrearMembresia from "./pages/CrearMembresia";
import EditarMembresia from "./pages/EditarMembresia";

// Entrenadores
import Entrenadores from "./pages/Entrenadores";
import CrearEntrenador from "./pages/CrearEntrenador";
import EditarEntrenador from "./pages/EditarEntrenador";

// Productos
import Productos from "./pages/Productos";
import CrearProducto from "./pages/CrearProducto";
import EditarProducto from "./pages/EditarProducto";

// Pagos
import Pagos from "./pages/pagos/Pagos";
import CrearPago from "./pages/pagos/CrearPago";
import EditarPago from "./pages/pagos/EditarPago";

// Contabilidad
import Contabilidad from "./pages/contabilidad/Contabilidad";
import CrearTransaccion from "./pages/contabilidad/CrearTransaccion";
import EditarTransaccion from "./pages/contabilidad/EditarTransaccion";

// Clases
import ListaClases from "./pages/sesiones/ListaClases";

// Usuarios
import Usuarios from "./pages/Usuarios";
import CrearUsuario from "./pages/usuarios/CrearUsuario";
import EditarUsuario from "./pages/usuarios/EditarUsuario";

// Asistencias
import Asistencias from "./pages/asistencias/Asistencias";
import RegistrarAsistencia from "./pages/asistencias/RegistrarAsistencia";

// Rutinas
import CrearRutina from "./pages/rutinas/CrearRutina";
import AsignarRutina from "./pages/rutinas/AsignarRutina";
import EditarAsignacionRutina from "./pages/rutinas/EditarAsignacionRutina";

// Composición Corporal
import ComposicionCorporal from "./pages/ComposicionCorporal";

// Indicadores
import Indicadores from "./pages/Indicadores";

// Componente para proteger rutas basadas en roles
const RoleBasedRoute = ({ element, allowedRoles }) => {
  const { user } = useAuth();

  if (!user || !user.rol) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.includes("admin") && user.rol === "admin") {
    return element;
  }

  if (!allowedRoles.includes(user.rol)) {
    return <Navigate to="/dashboard" replace />;
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
      <Route path="/rutinas/consultar" element={<ConsultarRutina />} />
      <Route
        path="/consultar-composicion-corporal"
        element={<ConsultarComposicionCorporal />}
      />
      <Route path="/videos-entrenamiento" element={<VideosEntrenamiento />} />
      <Route
        path="/"
        element={
          <Navigate
            to={localStorage.getItem("token") ? "/dashboard" : "/login"}
            replace
          />
        }
      />

      {/* Rutas Protegidas dentro del DashboardLayout */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/suscripcion" element={<Suscripcion />} />

          {/* Rutas para Recepcionistas y Admins */}
          <Route
            path="/consultar-rutina"
            element={
              <RoleBasedRoute
                element={<ConsultarRutina />}
                allowedRoles={["recepcionista", "entrenador", "admin"]}
              />
            }
          />
          <Route
            path="/clientes"
            element={
              <RoleBasedRoute
                element={<ListaClientes />}
                allowedRoles={["recepcionista", "admin"]}
              />
            }
          />
          <Route
            path="/clientes/crear"
            element={
              <RoleBasedRoute
                element={<CrearCliente />}
                allowedRoles={["recepcionista", "admin"]}
              />
            }
          />
          <Route
            path="/clientes/editar/:id"
            element={
              <RoleBasedRoute
                element={<EditarCliente />}
                allowedRoles={["recepcionista", "admin"]}
              />
            }
          />
          <Route
            path="/membresias"
            element={
              <RoleBasedRoute
                element={<Membresias />}
                allowedRoles={["recepcionista", "admin"]}
              />
            }
          />
          <Route
            path="/membresias/crear"
            element={
              <RoleBasedRoute
                element={<CrearMembresia />}
                allowedRoles={["recepcionista", "admin"]}
              />
            }
          />
          <Route
            path="/membresias/editar/:id"
            element={
              <RoleBasedRoute
                element={<EditarMembresia />}
                allowedRoles={["recepcionista", "admin"]}
              />
            }
          />
          <Route
            path="/entrenadores"
            element={
              <RoleBasedRoute
                element={<Entrenadores />}
                allowedRoles={["recepcionista", "admin"]}
              />
            }
          />
          <Route
            path="/entrenadores/crear"
            element={
              <RoleBasedRoute
                element={<CrearEntrenador />}
                allowedRoles={["recepcionista", "admin"]}
              />
            }
          />
          <Route
            path="/entrenadores/editar/:id"
            element={
              <RoleBasedRoute
                element={<EditarEntrenador />}
                allowedRoles={["recepcionista", "admin"]}
              />
            }
          />
          <Route
            path="/productos"
            element={
              <RoleBasedRoute
                element={<Productos />}
                allowedRoles={["recepcionista", "admin"]}
              />
            }
          />
          <Route
            path="/productos/crear"
            element={
              <RoleBasedRoute
                element={<CrearProducto />}
                allowedRoles={["recepcionista", "admin"]}
              />
            }
          />
          <Route
            path="/productos/editar/:id"
            element={
              <RoleBasedRoute
                element={<EditarProducto />}
                allowedRoles={["recepcionista", "admin"]}
              />
            }
          />
          <Route
            path="/pagos"
            element={
              <RoleBasedRoute
                element={<Pagos />}
                allowedRoles={["recepcionista", "admin"]}
              />
            }
          />
          <Route
            path="/pagos/crear"
            element={
              <RoleBasedRoute
                element={<CrearPago />}
                allowedRoles={["recepcionista", "admin"]}
              />
            }
          />
          <Route
            path="/pagos/editar/:id"
            element={
              <RoleBasedRoute
                element={<EditarPago />}
                allowedRoles={["recepcionista", "admin"]}
              />
            }
          />
          <Route
            path="/clases"
            element={
              <RoleBasedRoute
                element={<ListaClases />}
                allowedRoles={["recepcionista", "admin"]}
              />
            }
          />
          <Route
            path="/asistencias"
            element={
              <RoleBasedRoute
                element={<Asistencias />}
                allowedRoles={["recepcionista", "admin"]}
              />
            }
          />
          <Route
            path="/asistencias/registrar"
            element={
              <RoleBasedRoute
                element={<RegistrarAsistencia />}
                allowedRoles={["recepcionista", "admin"]}
              />
            }
          />

          {/* Rutas para Entrenadores y Admins */}
          <Route
            path="/rutinas/crear"
            element={
              <RoleBasedRoute
                element={<CrearRutina />}
                allowedRoles={["entrenador", "admin"]}
              />
            }
          />
          <Route
            path="/rutinas/asignar"
            element={
              <RoleBasedRoute
                element={<AsignarRutina />}
                allowedRoles={["entrenador", "admin"]}
              />
            }
          />
          <Route
            path="/rutinas/editar-asignacion"
            element={
              <RoleBasedRoute
                element={<EditarAsignacionRutina />}
                allowedRoles={["entrenador", "admin"]}
              />
            }
          />
          <Route
            path="/composicion-corporal"
            element={
              <RoleBasedRoute
                element={<ComposicionCorporal />}
                allowedRoles={["entrenador", "admin"]}
              />
            }
          />

          {/* Rutas Solo para Admins */}
          <Route
            path="/contabilidad"
            element={
              <RoleBasedRoute
                element={<Contabilidad />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/contabilidad/crear-transaccion"
            element={
              <RoleBasedRoute
                element={<CrearTransaccion />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/contabilidad/editar-transaccion/:id"
            element={
              <RoleBasedRoute
                element={<EditarTransaccion />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/usuarios"
            element={
              <RoleBasedRoute
                element={<Usuarios />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/usuarios/crear"
            element={
              <RoleBasedRoute
                element={<CrearUsuario />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/usuarios/editar/:id"
            element={
              <RoleBasedRoute
                element={<EditarUsuario />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/indicadores"
            element={
              <RoleBasedRoute
                element={<Indicadores />}
                allowedRoles={["admin"]}
              />
            }
          />
        </Route>
      </Route>
      {/* Ruta 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
