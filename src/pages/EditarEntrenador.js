import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerEntrenadorPorId, editarEntrenador } from "../api/axios";

const EditarEntrenador = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entrenador, setEntrenador] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    especialidad: "",
    telefono: "",
    clases: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEntrenador = async () => {
      try {
        const response = await obtenerEntrenadorPorId(id);
        setEntrenador(response.data); // Carga las clases desde el backend
        console.log("Datos del entrenador cargados:", response.data); // Depuración
      } catch (err) {
        console.error("Error al cargar el entrenador: ", err.message || "Sin detalles");
        if (err.message.includes("Sesión expirada")) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarEntrenador();
    } else {
      setLoading(false);
      navigate("/entrenadores");
    }
  }, [id, navigate]);

  const handleClaseChange = (index, field, value) => {
    const nuevasClases = [...entrenador.clases];
    nuevasClases[index] = { ...nuevasClases[index], [field]: value };
    setEntrenador({ ...entrenador, clases: nuevasClases });
  };

  const agregarClase = () => {
    setEntrenador({
      ...entrenador,
      clases: [...entrenador.clases, { nombreClase: "", capacidadMaxima: 0, dias: [] }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await editarEntrenador(id, entrenador);
      navigate("/entrenadores");
    } catch (err) {
      console.error("Error al guardar el entrenador:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Editar Entrenador</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={entrenador.nombre}
          onChange={(e) => setEntrenador({ ...entrenador, nombre: e.target.value })}
          placeholder="Nombre"
        />
        <input
          value={entrenador.apellido}
          onChange={(e) => setEntrenador({ ...entrenador, apellido: e.target.value })}
          placeholder="Apellido"
        />
        {/* Otros campos como correo, especialidad, teléfono */}
        <button type="button" onClick={agregarClase}>Agregar Clase</button>
        {entrenador.clases.map((clase, index) => (
          <div key={index}>
            <input
              value={clase.nombreClase || ""}
              onChange={(e) => handleClaseChange(index, "nombreClase", e.target.value)}
              placeholder="Nombre de la clase"
            />
            <input
              value={clase.capacidadMaxima || ""}
              onChange={(e) => handleClaseChange(index, "capacidadMaxima", e.target.value)}
              placeholder="Capacidad Máxima"
              type="number"
            />
            {/* Campo para días u otros atributos de clase */}
          </div>
        ))}
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default EditarEntrenador;
