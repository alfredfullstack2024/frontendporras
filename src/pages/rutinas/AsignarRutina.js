import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  obtenerClientes,
  obtenerRutinas,
  asignarRutina,
  consultarRutinaPorNumeroIdentificacion,
  obtenerEntrenadores,
} from "../../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Table,
  Alert,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

const AsignarRutina = () => {
  const [clientes, setClientes] = useState([]);
  const [rutinas, setRutinas] = useState([]);
  const [entrenadores, setEntrenadores] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [formData, setFormData] = useState({
    clienteId: "",
    equipo: "",
    posicion: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user || !user.token) {
      setError("Debes iniciar sesión para asignar una rutina.");
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [clientesRes, rutinasRes, entrenadoresRes] = await Promise.all([
          obtenerClientes(config),
          obtenerRutinas(config),
          obtenerEntrenadores(config),
        ]);
        console.log("Clientes cargados:", clientesRes.data);
        setClientes(clientesRes.data);
        setRutinas(rutinasRes.data);
        setEntrenadores(entrenadoresRes.data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(
          "Error al cargar datos: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };
    if (user && user.token) fetchData();
  }, [user]);

  const fetchAsignaciones = useCallback(async () => {
    try {
      setLoading(true);
      const cliente = clientes.find((c) => c._id === formData.clienteId);
      console.log("Cliente seleccionado:", cliente);
      if (cliente && cliente.numeroIdentificacion) {
        const numeroIdentificacion = cliente.numeroIdentificacion
          .toString()
          .trim();
        console.log(
          "Consultando asignaciones para numeroIdentificacion:",
          numeroIdentificacion
        );
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const response = await consultarRutinaPorNumeroIdentificacion(
          numeroIdentificacion,
          config
        );
        console.log(
          "Respuesta de fetchAsignaciones (data):",
          JSON.stringify(response.data, null, 2)
        );
        const asignacionesData = Array.isArray(response.data)
          ? response.data
          : [];
        console.log("Asignaciones procesadas:", asignacionesData);
        setAsignaciones(asignacionesData);
      } else {
        console.log(
          "Cliente no encontrado o sin numeroIdentificacion:",
          formData.clienteId
        );
        setAsignaciones([]);
        setError(
          "El cliente seleccionado no tiene un número de identificación válido."
        );
      }
    } catch (err) {
      console.error("Error al cargar asignaciones:", err.response?.data || err);
      setError(
        "Error al cargar asignaciones: " +
          (err.response?.data?.message || "Recurso no encontrado")
      );
      setAsignaciones([]);
    } finally {
      setLoading(false);
    }
  }, [clientes, formData.clienteId, user.token]);

  useEffect(() => {
    if (formData.clienteId) fetchAsignaciones();
    else setAsignaciones([]);
  }, [formData.clienteId, fetchAsignaciones]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clienteId || !formData.equipo || !formData.posicion) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const entrenador = entrenadores.find(e => e.especialidad.includes(formData.equipo));
      const diasHorarios = entrenador ? entrenador.diasHorarios.map(d => `${d.dia} ${d.horario}`).join(", ") : "";
      await asignarRutina({ ...formData, diasHorarios }, config);
      setSuccess("Rutina asignada con éxito!");
      setFormData({
        clienteId: formData.clienteId,
        equipo: "",
        posicion: "",
      });
      if (formData.clienteId) fetchAsignaciones();
    } catch (err) {
      console.error("Error al procesar asignación:", err);
      setError(
        "Error al procesar asignación: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData({
      clienteId: "",
      equipo: "",
      posicion: "",
    });
    setAsignaciones([]);
  };

  const filteredEquipos = [...new Set(entrenadores.map((e) => e.especialidad.split(" (")[1].replace(")", "")))].filter(
    (equipo) =>
      equipo && equipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="mt-4">
      <h2>Asignar Rutina</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      )}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Cliente</Form.Label>
              <Form.Select
                name="clienteId"
                value={formData.clienteId}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Seleccione un cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente._id} value={cliente._id}>
                    {cliente.nombre} {cliente.apellido || ""} -{" "}
                    {cliente.numeroIdentificacion}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Equipo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Buscar equipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-2"
              />
              <Form.Select
                name="equipo"
                value={formData.equipo}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Seleccione un equipo</option>
                {filteredEquipos.map((equipo, index) => (
                  <option key={index} value={equipo}>
                    {equipo}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Posición</Form.Label>
              <Form.Select
                name="posicion"
                value={formData.posicion}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Seleccione una posición</option>
                <option value="Flyer">Flyer</option>
                <option value="Base">Base</option>
                <option value="Spotter">Spotter</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" disabled={loading}>
          Asignar Rutina
        </Button>
        <Button
          variant="outline-secondary"
          className="ms-2"
          onClick={handleClearForm}
          disabled={loading}
        >
          Limpiar Formulario
        </Button>
      </Form>

      <div className="mt-5">
        <h3>Asignaciones del Cliente</h3>
        {asignaciones.length === 0 ? (
          <p>No hay asignaciones para este cliente.</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Posición</th>
                <th>Días y Horarios</th>
              </tr>
            </thead>
            <tbody>
              {asignaciones.map((asignacion) => (
                <tr key={asignacion._id || asignacion.fechaAsignacion}>
                  <td>{asignacion.equipo || "Desconocido"}</td>
                  <td>{asignacion.posicion || "N/A"}</td>
                  <td>{asignacion.diasHorarios || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </Container>
  );
};

export default AsignarRutina;
