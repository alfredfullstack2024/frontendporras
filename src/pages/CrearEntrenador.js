import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { crearEntrenador } from "../api/axios";

const CrearEntrenador = () => {
  const navigate = useNavigate();
  const [entrenador, setEntrenador] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    especialidad: "",
    diasHorarios: [],
  });
  const [error, setError] = useState(null);

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
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await crearEntrenador(entrenador, config);
      alert("Entrenador creado con éxito");
      navigate("/entrenadores");
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al crear el entrenador");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Container>
      <h2>Crear Entrenador</h2>
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
                value={item.dia}
                onChange={(e) => handleDiaChange(index, "dia", e.target.value)}
                required
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Horario (ej. 08:00 a.m. - 10:00 a.m.)"
                value={item.horario}
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
          Crear
        </Button>
      </Form>
    </Container>
  );
};

export default CrearEntrenador;
