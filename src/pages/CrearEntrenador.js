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
    diasHorarios: [{ dia: "", horario: "" }], // Cambiado de clases a diasHorarios
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
      // Validar que cada día tenga dia y horario
      const diasValidos = entrenador.diasHorarios.filter(d => d.dia && d.horario);
      if (diasValidos.length === 0) {
        setError("Debe haber al menos un día y horario válido.");
        return;
      }
      await crearEntrenador({ ...entrenador, diasHorarios: diasValidos }, config);
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
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Especialidad (Equipo)</Form.Label>
          <Form.Control
            type="text"
            value={entrenador.especialidad}
            onChange={(e) => setEntrenador({ ...entrenador, especialidad: e.target.value })}
            required
          />
        </Form.Group>

        {entrenador.diasHorarios.map((dia, index) => (
          <Row key={index} className="mb-2">
            <Col>
              <Form.Control
                type="text"
                placeholder="Día"
                value={dia.dia}
                onChange={(e) => handleDiaChange(index, "dia", e.target.value)}
                list="dias"
              />
              <datalist id="dias">
                <option value="Lunes" />
                <option value="Martes" />
                <option value="Miércoles" />
                <option value="Jueves" />
                <option value="Viernes" />
                <option value="Sábado" />
                <option value="Domingo" />
              </datalist>
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Horario (ej: 10:00-12:00)"
                value={dia.horario}
                onChange={(e) => handleDiaChange(index, "horario", e.target.value)}
              />
            </Col>
            <Col>
              <Button variant="danger" onClick={() => eliminarDia(index)} disabled={entrenador.diasHorarios.length === 1}>
                Eliminar
              </Button>
            </Col>
          </Row>
        ))}
        <Button variant="secondary" onClick={agregarDia}>
          Agregar Día
        </Button>

        <Button variant="primary" type="submit">
          Crear
        </Button>
      </Form>
    </Container>
  );
};

export default CrearEntrenador;
