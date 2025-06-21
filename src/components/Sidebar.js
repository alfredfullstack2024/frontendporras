import { NavLink, useNavigate } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    console.error("AuthContext no está disponible en Sidebar.js");
    return null;
  }
  const { user } = context;
  console.log("Usuario en Sidebar - Rol:", user ? user.rol : "No autenticado");
  console.log("Usuario completo:", user ? JSON.stringify(user) : "Sin usuario");

  // Definir los ítems del menú según el rol
  const menuItems = {
    admin: [
      { label: "📊 Panel", path: "/dashboard" },
      { label: "🧍 Clientes", path: "/clientes" },
      { label: "📦 Productos", path: "/productos" },
      { label: "🎟️ Membresías", path: "/membresias" },
      { label: "💵 Pagos", path: "/pagos" },
      { label: "📊 Contabilidad", path: "/contabilidad" },
      { label: "👥 Usuarios", path: "/usuarios" },
      { label: "🏋️♂️ Entrenadores", path: "/entrenadores" },
      { label: "🕒 Clases", path: "/clases" },
      // { label: "📋 Registrar Asistencia", path: "/asistencias/registrar" }, // Eliminado
      { label: "📝 Suscripción", path: "/suscripcion" },
      { label: "📈 Indicadores", path: "/indicadores" },
      { label: "🏋️ Rutinas", path: "/rutinas/crear" },
      { label: "📋 Asignar Rutina", path: "/rutinas/asignar" },
      { label: "📏 Composición Corporal", path: "/composicion-corporal" },
      { label: "🔍 Consultar Composición", path: "/consultar-composicion-corporal" },
      { label: "🎥 Videos Entrenamiento", path: "/videos-entrenamiento" },
      { label: "✏️ Editar Clases", path: "/entrenadores/editar-clases" }, // Ruta intermedia
    ],
    entrenador: [
      { label: "🏋️ Rutinas", path: "/rutinas/crear" },
      { label: "📋 Asignar Rutina", path: "/rutinas/asignar" },
      { label: "📏 Composición Corporal", path: "/composicion-corporal" },
      { label: "🔍 Consultar Composición", path: "/consultar-composicion-corporal" },
      { label: "🎥 Videos Entrenamiento", path: "/videos-entrenamiento" },
      { label: "✏️ Editar Clases", path: "/entrenadores/editar-clases" }, // Ruta intermedia
    ],
    // Ítems públicos para usuarios (incluyendo rol "user")
    public: [
      { label: "🔍 Consultar Rutinas", path: "/rutinas/consultar" },
      { label: "📏 Consultar Composición Corporal", path: "/consultar-composicion-corporal" },
      { label: "🎥 Asesoramiento de Ejercicios", path: "/videos-entrenamiento" },
      { label: "🕒 Clases", path: "/clases" }, // Asegurado para rol "user"
    ],
  };

  // Forzar ítems, asegurando Clases para "user" y depuración
  const itemsToShow = user
    ? user.rol === "user" || !user.rol // Forzar para "user" o rol indefinido
      ? [
          ...menuItems.public,
          { label: "🕒 Clases", path: "/clases" }, // Garantizar Clases
        ]
      : [...menuItems[user.rol] || menuItems.entrenador, ...menuItems.public]
    : menuItems.public;

  console.log("Renderizando Sidebar... Items:", itemsToShow.map((item) => item.label));

  const handleEditarClasesClick = () => {
    navigate("/entrenadores"); // Redirige a la lista de entrenadores para seleccionar ID
  };

  return (
    <div className="sidebar p-3 bg-dark text-white vh-100">
      <div className="text-center mb-4">
        <img src="/logo192.png" alt="Logo Admin Gym" style={{ width: "100px" }} />
      </div>
      <ListGroup variant="flush">
        {itemsToShow.map((item) => (
          <ListGroup.Item
            key={item.path}
            as={item.label === "✏️ Editar Clases" ? "div" : NavLink}
            to={item.label !== "✏️ Editar Clases" ? item.path : undefined}
            className={({ isActive }) =>
              item.label !== "✏️ Editar Clases" && isActive
                ? "sidebar-item active"
                : "sidebar-item"
            }
            onClick={
              item.label === "✏️ Editar Clases" ? handleEditarClasesClick : undefined
            }
            style={{ cursor: item.label === "✏️ Editar Clases" ? "pointer" : "default" }}
          >
            {item.label}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Sidebar;
