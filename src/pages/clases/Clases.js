import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Clases = () => {
  const [clases, setClases] = useState([]);
  const [nombre, setNombre] = useState("");
  const [horario, setHorario] = useState("");
  const [numeroIdentificacion, setNumeroIdentificacion] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClases = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await api.get("/clases");
        setClases(response.data);
      } catch (err) {
        setError("No se pudieron cargar las clases: " + (err.response?.data?.mensaje || err.message));
      } finally {
        setIsLoading(false);
      }
    };

    fetchClases();
  }, [navigate]);

  const handleRegistrar = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await api.post("/clases/registrar", { nombre, horario });
      setNombre("");
      setHorario("");
      const response = await api.get("/clases");
      setClases(response.data);
    } catch (err) {
      setError("Error al registrar la clase: " + (err.response?.data?.mensaje || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Clases Disponibles</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {isLoading && <Alert variant="info">Cargando...</Alert>}
      {!isLoading && !error && clases.length === 0 && (
        <Alert variant="info">No hay clases disponibles.</Alert>
      )}
      <Form onSubmit={handleRegistrar}>
        <Form.Group controlId="nombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="horario">
          <Form.Label>Horario</Form.Label>
          <Form.Control
            type="text"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="numeroIdentificacion">
          <Form.Label>Número de identificación</Form.Label>
          <Form.Control
            type="text"
            value={numeroIdentificacion}
            onChange={(e) => setNumeroIdentificacion(e.target.value)}
            placeholder="Ingrese el número de identificación"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3" disabled={isLoading}>
          Registrar Clase
        </Button>
      </Form>
      {!isLoading && !error && clases.length > 0 && (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Horario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clases.map((clase) => (
              <tr key={clase._id}>
                <td>{clase.nombre}</td>
                <td>{clase.horario}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2">
                    Editar
                  </Button>
                  <Button variant="danger" size="sm">
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Clases;
