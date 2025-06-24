import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Clases = () => {
  const [clases, setClases] = useState([]);
  const [selectedClase, setSelectedClase] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const numeroIdentificacion = user?.numeroIdentificacion || "";

  useEffect(() => {
    const fetchClasesDisponibles = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await api.get("/clases/disponibles");
        if (response.data && Array.isArray(response.data)) {
          setClases(response.data);
        } else {
          setClases([]);
          setError("No hay clases disponibles o formato inesperado");
        }
      } catch (err) {
        setError("No se pudieron cargar las clases: " + (err.response?.data?.message || err.message));
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasesDisponibles();
  }, [navigate]);

  const handleInscribirse = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    if (!selectedClase) {
      setError("Por favor, selecciona una clase.");
      setIsLoading(false);
      return;
    }

    const claseSeleccionada = clases.find((c) => c._id === selectedClase);
    if (claseSeleccionada.capacidadDisponible <= 0) {
      setError("No hay cupos disponibles para esta clase.");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/clases/registrar", {
        numeroIdentificacion,
        entrenadorId: claseSeleccionada.entrenadorId,
        nombreClase: claseSeleccionada.nombreClase,
        dia: claseSeleccionada.dia,
        horarioInicio: claseSeleccionada.horarioInicio,
        horarioFin: claseSeleccionada.horarioFin,
      });
      setSelectedClase("");
      const response = await api.get("/clases/disponibles");
      setClases(response.data);
      alert("Inscripción exitosa");
    } catch (err) {
      setError("Error al inscribirse: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Inscribirse en Clases</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {isLoading && <Alert variant="info">Cargando...</Alert>}
      {!isLoading && !error && clases.length === 0 && (
        <Alert variant="info">No hay clases disponibles.</Alert>
      )}
      <Form onSubmit={handleInscribirse}>
        <Form.Group controlId="clase">
          <Form.Label>Clase Disponible</Form.Label>
          <Form.Control
            as="select"
            value={selectedClase}
            onChange={(e) => setSelectedClase(e.target.value)}
            required
          >
            <option value="">Selecciona una clase</option>
            {clases.map((clase) => (
              <option key={clase._id} value={clase._id}>
                {clase.nombreClase} - {clase.dia} {clase.horarioInicio}-{clase.horarioFin} (Cupos: {clase.capacidadDisponible})
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3" disabled={isLoading || !selectedClase}>
          Inscribirse
        </Button>
      </Form>
      {!isLoading && !error && (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Día</th>
              <th>Horario</th>
              <th>Cupos Disponibles</th>
            </tr>
          </thead>
          <tbody>
            {clases.map((clase) => (
              <tr key={clase._id}>
                <td>{clase.nombreClase}</td>
                <td>{clase.dia}</td>
                <td>{clase.horarioInicio} - {clase.horarioFin}</td>
                <td>{clase.capacidadDisponible}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Clases;
