import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Clases = () => {
  const [clases, setClases] = useState([]);
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
        if (err.response && err.response.status === 403) {
          // Redirigir al dashboard o mostrar mensaje genérico
          navigate("/dashboard");
          setError("No tienes permisos para ver esta sección. Redirigiendo al Dashboard.");
        } else {
          setError("No se pudieron cargar las clases: " + (err.response?.data?.mensaje || err.message));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchClases();
  }, [navigate]);

  return (
    <div className="container mt-4">
      <h2>Lista de Clases Disponibles</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {isLoading && <Alert variant="info">Cargando clases...</Alert>}
      {!isLoading && !error && clases.length === 0 && (
        <Alert variant="info">No hay clases disponibles.</Alert>
      )}
      <Form>
        <Form.Group controlId="numeroIdentificacion">
          <Form.Label>Número de identificación</Form.Label>
          <Form.Control
            type="text"
            value={numeroIdentificacion}
            onChange={(e) => setNumeroIdentificacion(e.target.value)}
            placeholder="Ingrese el número de identificación"
          />
        </Form.Group>
      </Form>
      {/* Aquí iría la tabla de clases si hay datos y permisos */}
    </div>
  );
};

export default Clases;
