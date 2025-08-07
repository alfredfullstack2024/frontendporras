import React, { useState, useEffect } from "react";
import { crearRutina, obtenerRutinas, editarRutina } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Table, Alert } from "react-bootstrap";

const Categorizacion = () => {
  const [formData, setFormData] = useState({
    equipo: "",
    nivelDeEquipo: "",
    posicion: "",
    descripcion: "",
  });
  const [rutinas, setRutinas] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  // Verificar token al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token en localStorage:", token); // Depuración
    if (!token) {
      setError("Debes iniciar sesión para categorizar.");
      navigate("/login");
    }
  }, [navigate]);

  // Cargar las rutinas al montar el componente
  const fetchRutinas = async () => {
    try {
      const response = await obtenerRutinas();
      console.log("Rutinas obtenidas:", response.data); // Depuración
      setRutinas(response.data);
    } catch (err) {
      console.error("Error al obtener rutinas:", err);
      setError("Error al cargar las categorizaciones: " + err.message);
    }
  };

  useEffect(() => {
    fetchRutinas();
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
        response = await editarRutina(editId, formData);
        console.log("Respuesta del backend (editar):", response.data); // Depuración
        setSuccess("Categorización actualizada con éxito!");
        setEditMode(false);
        setEditId(null);
      } else {
        response = await crearRutina(formData);
        console.log("Respuesta del backend (crear):", response.data); // Depuración
        setSuccess("Categorización creada con éxito!");
      }

      setFormData({
        equipo: "",
        nivelDeEquipo: "",
        posicion: "",
        descripcion: "",
      });
      fetchRutinas();
    } catch (err) {
      console.error("Error al procesar categorización:", err.response?.data || err);
      if (err.response?.status === 401) {
        setError("Sesión expirada. Por favor, inicia sesión de nuevo.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(
          err.response?.data?.mensaje ||
            err.message ||
            "Error al procesar la categorización. Revisa los datos e intenta de nuevo."
        );
      }
    }
  };

  const handleEdit = (rutina) => {
    setEditMode(true);
    setEditId(rutina._id);
    setFormData({
      equipo: rutina.equipo,
      nivelDeEquipo: rutina.nivelDeEquipo,
      posicion: rutina.posicion,
      descripcion: rutina.descripcion || "",
    });
  };

  const nivelesPorEquipo = {
    "Equipo 1": [
      { nivel: "Principiante A", division: "A" },
      { nivel: "Principiante B", division: "B" },
      { nivel: "Principiante C", division: "C" },
    ],
    "Equipo 2": [
      { nivel: "Principiante A", division: "A" },
      { nivel: "Principiante B", division: "B" },
      { nivel: "Principiante C", division: "C" },
    ],
    // Extiende hasta Equipo 20
    "Equipo 3": [
      { nivel: "Intermedio A", division: "A" },
      { nivel: "Intermedio B", division: "B" },
      { nivel: "Intermedio C", division: "C" },
    ],
    "Equipo 4": [
      { nivel: "Intermedio A", division: "A" },
      { nivel: "Intermedio B", division: "B" },
      { nivel: "Intermedio C", division: "C" },
    ],
    "Equipo 5": [
      { nivel: "Avanzado A", division: "A" },
      { nivel: "Avanzado B", division: "B" },
      { nivel: "Avanzado C", division: "C" },
    ],
    "Equipo 6": [
      { nivel: "Avanzado A", division: "A" },
      { nivel: "Avanzado B", division: "B" },
      { nivel: "Avanzado C", division: "C" },
    ],
    "Equipo 7": [
      { nivel: "Principiante A", division: "A" },
      { nivel: "Principiante B", division: "B" },
      { nivel: "Principiante C", division: "C" },
    ],
    "Equipo 8": [
      { nivel: "Intermedio A", division: "A" },
      { nivel: "Intermedio B", division: "B" },
      { nivel: "Intermedio C", division: "C" },
    ],
    "Equipo 9": [
      { nivel: "Avanzado A", division: "A" },
      { nivel: "Avanzado B", division: "B" },
      { nivel: "Avanzado C", division: "C" },
    ],
    "Equipo 10": [
      { nivel: "Principiante A", division: "A" },
      { nivel: "Principiante B", division: "B" },
      { nivel: "Principiante C", division: "C" },
    ],
    "Equipo 11": [
      { nivel: "Intermedio A", division: "A" },
      { nivel: "Intermedio B", division: "B" },
      { nivel: "Intermedio C", division: "C" },
    ],
    "Equipo 12": [
      { nivel: "Avanzado A", division: "A" },
      { nivel: "Avanzado B", division: "B" },
      { nivel: "Avanzado C", division: "C" },
    ],
    "Equipo 13": [
      { nivel: "Principiante A", division: "A" },
      { nivel: "Principiante B", division: "B" },
      { nivel: "Principiante C", division: "C" },
    ],
    "Equipo 14": [
      { nivel: "Intermedio A", division: "A" },
      { nivel: "Intermedio B", division: "B" },
      { nivel: "Intermedio C", division: "C" },
    ],
    "Equipo 15": [
      { nivel: "Avanzado A", division: "A" },
      { nivel: "Avanzado B", division: "B" },
      { nivel: "Avanzado C", division: "C" },
    ],
    "Equipo 16": [
      { nivel: "Principiante A", division: "A" },
      { nivel: "Principiante B", division: "B" },
      { nivel: "Principiante C", division: "C" },
    ],
    "Equipo 17": [
      { nivel: "Intermedio A", division: "A" },
      { nivel: "Intermedio B", division: "B" },
      { nivel: "Intermedio C", division: "C" },
    ],
    "Equipo 18": [
      { nivel: "Avanzado A", division: "A" },
      { nivel: "Avanzado B", division: "B" },
      { nivel: "Avanzado C", division: "C" },
    ],
    "Equipo 19": [
      { nivel: "Principiante A", division: "A" },
      { nivel: "Principiante B", division: "B" },
      { nivel: "Principiante C", division: "C" },
    ],
    "Equipo 20": [
      { nivel: "Intermedio A", division: "A" },
      { nivel: "Intermedio B", division: "B" },
      { nivel: "Intermedio C", division: "C" },
    ],
  };

  return (
    <Container className="mt-4">
      <h2>{editMode ? "Editar Categorización" : "Categorización"}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Equipo</Form.Label>
          <Form.Select
            name="equipo"
            value={formData.equipo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un equipo</option>
            {Array.from({ length: 20 }, (_, i) => `Equipo ${i + 1}`).map((equipo) => (
              <option key={equipo} value={equipo}>
                {equipo}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nivel de Equipo</Form.Label>
          <Form.Select
            name="nivelDeEquipo"
            value={formData.nivelDeEquipo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un nivel</option>
            {formData.equipo &&
              nivelesPorEquipo[formData.equipo].map((item, index) => (
                <option key={index} value={`${item.nivel} ${item.division}`}>
                  {`${item.nivel} ${item.division}`}
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
            <option value="Flyer">Flyer</option>
            <option value="Base">Base</option>
            <option value="Spotter">Spotter</option>
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
          {editMode ? "Actualizar Categorización" : "Categorizar"}
        </Button>
        {editMode && (
          <Button
            variant="secondary"
            className="ms-2"
            onClick={() => {
              setEditMode(false);
              setEditId(null);
              setFormData({
                equipo: "",
                nivelDeEquipo: "",
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
        <h3>Categorizaciones Creadas</h3>
        {rutinas.length === 0 ? (
          <p>No hay categorizaciones creadas aún.</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Nivel de Equipo</th>
                <th>Posición</th>
                <th>Descripción</th>
                <th>Creado Por</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rutinas.map((rutina) => (
                <tr key={rutina._id}>
                  <td>{rutina.equipo}</td>
                  <td>{rutina.nivelDeEquipo}</td>
                  <td>{rutina.posicion}</td>
                  <td>{rutina.descripcion || "N/A"}</td>
                  <td>
                    {rutina.creadoPor ? rutina.creadoPor.nombre : "Desconocido"}
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleEdit(rutina)}
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

export default Categorizacion;
