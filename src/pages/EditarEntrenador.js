import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const EditarEntrenador = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entrenador, setEntrenador] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    especialidad: "",
    diasHorarios: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntrenador = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/entrenadores/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setEntrenador({
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          correo: data.correo || "",
          telefono: data.telefono || "",
          especialidad: data.especialidad || "",
          diasHorarios: Array.isArray(data.diasHorarios) ? data.diasHorarios : [],
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.mensaje || "Error al cargar el entrenador");
        setLoading(false);
      }
    };
    if (id) fetchEntrenador();
    else {
      setError("ID de entrenador no proporcionado");
      setLoading(false);
    }
  }, [id]);

  const handleDiaChange = (index, field, value) => {
    const nuevosDias = [...entrenador.diasHorarios];
    nuevosDias[index][field] = value;
    setEntrenador({ ...entrenador, diasHorarios: nuevosDias });
  };

  const agregarDia = () => {
    setEntrenador({
      ...entrenador,
      diasHorarios: [...entrenador.diasHorarios, { dia: "", horario: "" }],
    });
  };

  const eliminarDia = (index) => {
    const nuevosDias = [...entrenador.diasHorarios];
    nuevosDias.splice(index, 1);
    setEntrenador({ ...entrenador, diasHorarios: nuevosDias });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/entrenadores/${id}`, entrenador, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Entrenador actualizado con éxito");
      navigate("/entrenadores");
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al actualizar el entrenador");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Container>
      <h2>Editar Entrenador</h2>
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

        <h5>Días y Horarios</h5>
        {entrenador.diasHorarios.map((item, index) => (
          <Row key={index} className="mb-2">
            <Col>
              <Form.Control
                type="text"
                placeholder="Día (ej. Lunes)"
                value={item.dia || ""}
                onChange={(e) => handleDiaChange(index, "dia", e.target.value)}
                required
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Horario (ej. 08:00 a.m. - 10:00 a.m.)"
                value={item.horario || ""}
                onChange={(e) => handleDiaChange(index, "horario", e.target.value)}
                required
              />
            </Col>
            <Col>
              <Button variant="danger" onClick={() => eliminarDia(index)}>
                Eliminar
              </Button>
            </Col>
          </Row>
        ))}
        <Button variant="secondary" onClick={agregarDia}>
          Agregar Día
        </Button>

        <Button variant="primary" type="submit" className="mt-3">
          Actualizar Entrenador
        </Button>
      </Form>
    </Container>
  );
};

export default EditarEntrenador;
