import React, { useState, useEffect } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Entrenadores = () => {
  const [entrenadores, setEntrenadores] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntrenadores = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await api.get("/entrenadores");
        setEntrenadores(response.data);
      } catch (err) {
        setError("Error al cargar los entrenadores: " + (err.response?.data?.mensaje || err.message));
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntrenadores();
  }, [navigate]);

  return (
    <div className="container mt-4">
      <h2>Lista de Entrenadores</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {isLoading && <Alert variant="info">Cargando entrenadores...</Alert>}
      {!isLoading && !error && entrenadores.length === 0 && (
        <Alert variant="info">No hay entrenadores para mostrar.</Alert>
      )}
      {!isLoading && !error && entrenadores.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo electrónico</th>
              <th>Especialidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {entrenadores.map((entrenador) => (
              <tr key={entrenador._id}>
                <td>{entrenador.nombre}</td>
                <td>{entrenador.apellido}</td>
                <td>{entrenador.correo}</td>
                <td>{entrenador.especialidad}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/entrenadores/editar/${entrenador._id}`)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      if (window.confirm("¿Estás seguro de eliminar este entrenador?")) {
                        // Lógica de eliminación aquí si la tienes
                      }
                    }}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Button variant="primary" className="mt-3" onClick={() => navigate("/entrenadores/crear")}>
        Crear entrenador
      </Button>
    </div>
  );
};

export default Entrenadores;
