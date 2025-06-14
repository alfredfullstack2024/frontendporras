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
  console.log("Usuario en Sidebar:", user);

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
      { label: "🏋️‍♂️ Entrenadores", path: "/entrenadores" },
      { label: "🕒 Clases", path: "/clases" },
      { label: "📋 Registrar Asistencia", path: "/registrar-asistencia" },
      { label: "📝 Suscripción", path: "/suscripcion" },
      { label: "📈 Indicadores", path: "/indicadores" },
      { label: "🏋️ Rutinas", path: "/rutinas/crear" },
      { label: "📋 Asignar Rutina", path: "/rutinas/asignar" },
      { label: "📏 Composición Corporal", path: "/composicion-corporal" },
      {
        label: "🔍 Consultar Composición",
        path: "/consultar-composicion-corporal",
      },
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
  };

  // Seleccionar los ítems según el rol del usuario
  const itemsToShow = user ? menuItems[user.rol] || menuItems.entrenador : [];

  console.log(
    "Renderizando Sidebar... Items:",
    itemsToShow.map((item) => item.label)
  );

  const handleEditarClasesClick = () => {
    navigate("/entrenadores"); // Redirige a la lista de entrenadores para seleccionar ID
    // Alternativa: prompt para ID
    // const id = prompt("Ingresa el ID del entrenador:");
    // if (id) navigate(`/entrenadores/${id}/editar-clases`);
  };

  return (
    <div className="sidebar p-3 bg-dark text-white vh-100">
      <h4 className="text-center mb-4">🏋️ Admin Gym</h4>
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
