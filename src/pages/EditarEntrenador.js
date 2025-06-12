import React, { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerEntrenadorPorId, editarEntrenador, crearEntrenador } from "../../api/axios";

const EditarEntrenador = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entrenador, setEntrenador] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    especialidad: "",
    clases: [{ nombreClase: "", dias: [], capacidadMaxima: 10 }],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      const fetchEntrenador = async () => {
        setLoading(true);
        try {
          const response = await obtenerEntrenadorPorId(id, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
          setEntrenador(response.data || {
            nombre: "",
            apellido: "",
            correo: "",
            telefono: "",
            especialidad: "",
            clases: [{ nombreClase: "", dias: [], capacidadMaxima: 10 }],
          });
        } catch (err) {
          setError("Error al cargar el entrenador: " + (err.message || "Sin detalles"));
        } finally {
          setLoading(false);
        }
      };
      fetchEntrenador();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
      if (id) {
        await editarEntrenador(id, entrenador, config);
      } else {
        await crearEntrenador(entrenador, config);
      }
      navigate("/entrenadores");
    } catch (err) {
      setError("Error al guardar el entrenador: " + (err.message || "Sin detalles"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Container>
      <h2>{id ? "Editar" : "Crear"} Entrenador</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={entrenador.nombre}
            onChange={(e) => setEntrenador({ ...entrenador, nombre: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            type="text"
            value={entrenador.apellido}
            onChange={(e) => setEntrenador({ ...entrenador, apellido: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Correo</Form.Label>
          <Form.Control
            type="email"
            value={entrenador.correo}
            onChange={(e) => setEntrenador({ ...entrenador, correo: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="text"
            value={entrenador.telefono}
            onChange={(e) => setEntrenador({ ...entrenador, telefono: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Especialidad</Form.Label>
          <Form.Control
            type="text"
            value={entrenador.especialidad}
            onChange={(e) => setEntrenador({ ...entrenador, especialidad: e.target.value })}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {id ? "Actualizar" : "Crear"} Entrenador
        </Button>
      </Form>
    </Container>
  );
};

export default EditarEntrenador;
