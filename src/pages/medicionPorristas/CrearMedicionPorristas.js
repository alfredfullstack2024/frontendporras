import React, { useState, useEffect } from "react";
import {
  crearMedicionPorristas,
  obtenerMedicionesPorristas,
  editarMedicionPorristas,
} from "../../api/axios";
import { obtenerEntrenadores } from "../../api/axios"; // Nueva función para obtener entrenadores
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Table, Alert } from "react-bootstrap";

const CrearMedicionPorristas = () => {
  const [formData, setFormData] = useState({
    entrenadorId: "",
    equipo: "",
    categoria: "",
    posicion: "",
    descripcion: "",
  });
  const [entrenadores, setEntrenadores] = useState([]);
  const [mediciones, setMediciones] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  // Categorías predefinidas
  const categorias = [
    "1.1 MINI",
    "1.1 YOUTH",
    "1.1 SENIOR",
    "2.1 JUNIOR",
    "2.1 OPEN",
    "2.2 JUNIOR",
    "2.2 SENIOR",
    "1 TINY",
    "1 MINI",
    "1 YOUTH",
    "1 JUNIOR",
    "1 SENIOR",
    "2 YOUTH",
    "2 JUNIOR",
    "2 SENIOR",
    "2 OPEN",
    "3 YOUTH",
    "3 JUNIOR",
    "3 SENIOR",
    "3 OPEN",
    "3 OPEN NON-TUMBLING",
    "4.2 OPEN",
    "4 SENIOR",
    "4 OPEN FEM",
    "4 OPEN MEDIUM",
    "4 OPEN LARGE",
    "5 OPEN",
    "5 OPEN NON-TUMBLING",
    "6 OPEN",
    "7.5 OPEN",
    "7 OPEN",
  ];

  // Posiciones predefinidas
  const posiciones = ["Flyer", "Base", "Spotter", "Backspot", "Frontspot"];

  // Verificar token al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Debes iniciar sesión para crear una medición.");
      navigate("/login");
    }
  }, [navigate]);

  // Cargar entrenadores y mediciones al montar el componente
  const fetchData = async () => {
    try {
      const [entrenadoresResponse, medicionesResponse] = await Promise.all([
        obtenerEntrenadores(),
        obtenerMedicionesPorristas(),
      ]);
      setEntrenadores(entrenadoresResponse.data);
      setMediciones(medicionesResponse.data);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError("Error al cargar datos: " + err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      let response;
      if (editMode) {
        response = await editarMedicionPorristas(editId, formData);
        setSuccess("Medición actualizada con éxito!");
        setEditMode(false);
        setEditId(null);
      } else {
        response = await crearMedicionPorristas(formData);
        setSuccess("Medición creada con éxito!");
      }

      // Limpiar el formulario
      setFormData({
        entrenadorId: "",
        equipo: "",
        categoria: "",
        posicion: "",
        descripcion: "",
      });
      // Recargar las mediciones
      fetchData();
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Sesión expirada. Por favor, inicia sesión de nuevo.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(
          err.response?.data?.mensaje || "Error al procesar la medición."
        );
      }
    }
  };

  const handleEdit = (medicion) => {
    setEditMode(true);
    setEditId(medicion._id);
    setFormData({
      entrenadorId: medicion.entrenadorId._id,
      equipo: medicion.equipo,
      categoria: medicion.categoria,
      posicion: medicion.posicion,
      descripcion: medicion.descripcion || "",
    });
  };

  // Obtener equipos según la especialidad del entrenador seleccionado
  const equiposPorEntrenador =
    entrenadores.find((e) => e._id === formData.entrenadorId)?.especialidad ||
    [];

  return (
    <Container className="mt-4">
      <h2>
        {editMode ? "Editar Medición Porristas" : "Crear Medición Porristas"}
      </h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Entrenador</Form.Label>
          <Form.Select
            name="entrenadorId"
            value={formData.entrenadorId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un entrenador</option>
            {entrenadores.map((entrenador) => (
              <option key={entrenador._id} value={entrenador._id}>
                {entrenador.nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Equipo</Form.Label>
          <Form.Select
            name="equipo"
            value={formData.equipo}
            onChange={handleChange}
            required
            disabled={!formData.entrenadorId}
          >
            <option value="">Seleccione un equipo</option>
            {equiposPorEntrenador.map((equipo, index) => (
              <option key={index} value={equipo}>
                {equipo}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Categoría</Form.Label>
          <Form.Select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Posición</Form.Label>
          <Form.Select
            name="posicion"
            value={formData.posicion}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una posición</option>
            {posiciones.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descripción (Opcional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          {editMode ? "Actualizar Medición" : "Crear Medición"}
        </Button>
        {editMode && (
          <Button
            variant="secondary"
            className="ms-2"
            onClick={() => {
              setEditMode(false);
              setEditId(null);
              setFormData({
                entrenadorId: "",
                equipo: "",
                categoria: "",
                posicion: "",
                descripcion: "",
              });
            }}
          >
            Cancelar Edición
          </Button>
        )}
      </Form>

      <div className="mt-5">
        <h3>Mediciones Creadas</h3>
        {mediciones.length === 0 ? (
          <p>No hay mediciones creadas aún.</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Entrenador</th>
                <th>Equipo</th>
                <th>Categoría</th>
                <th>Posición</th>
                <th>Descripción</th>
                <th>Creado Por</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mediciones.map((medicion) => (
                <tr key={medicion._id}>
                  <td>{medicion.entrenadorId.nombre}</td>
                  <td>{medicion.equipo}</td>
                  <td>{medicion.categoria}</td>
                  <td>{medicion.posicion}</td>
                  <td>{medicion.descripcion || "N/A"}</td>
                  <td>{medicion.creadoPor?.nombre || "Desconocido"}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleEdit(medicion)}
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </Container>
  );
};

export default CrearMedicionPorristas;
