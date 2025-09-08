import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import { crearCliente, obtenerEntrenadores } from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const CrearCliente = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    estado: "activo",
    numeroIdentificacion: "",
    fechaNacimiento: "",
    tipoDocumento: "C.C",
    rh: "",
    eps: "",
    tallaTrenSuperior: "",
    tallaTrenInferior: "",
    nombreResponsable: "",
    equipo: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [equipos, setEquipos] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Función para calcular edad a partir de la fecha de nacimiento
  const calcularEdad = (fecha) => {
    if (!fecha) return null;
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await obtenerEntrenadores();
        const equiposUnicos = [
          ...new Set(
            response.data.flatMap((entrenador) =>
              Array.isArray(entrenador.especialidad)
                ? entrenador.especialidad
                : [entrenador.especialidad]
            ).filter((especialidad) => especialidad)
          ),
        ];
        setEquipos(equiposUnicos);
      } catch (err) {
        setError("Error al cargar equipos: " + err.message);
      }
    };
    fetchEquipos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones mínimas
    if (!formData.nombre.trim()) return setError("El nombre es obligatorio.");
    if (!formData.apellido.trim()) return setError("El apellido es obligatorio.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return setError("Correo electrónico inválido.");
    if (!/^\d{10}$/.test(formData.telefono)) return setError("El teléfono debe tener 10 dígitos numéricos.");
    if (!formData.direccion.trim()) return setError("La dirección es obligatoria.");
    if (!formData.numeroIdentificacion.trim()) return setError("El número de identificación es obligatorio.");
    if (!formData.fechaNacimiento) return setError("La fecha de nacimiento es obligatoria.");

    const edadCalculada = calcularEdad(formData.fechaNacimiento);
    if (!edadCalculada || edadCalculada <= 0) return setError("Fecha de nacimiento inválida.");

    if (!user || !user.token) return setError("Debes iniciar sesión para crear un cliente.");

    // Prepara datos
    const dataToSend = {
      ...formData,
      edad: edadCalculada,
      fechaNacimiento: new Date(formData.fechaNacimiento),
    };

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const response = await crearCliente(dataToSend, config);
      setSuccess("Cliente creado con éxito!");
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        direccion: "",
        estado: "activo",
        numeroIdentificacion: "",
        fechaNacimiento: "",
        tipoDocumento: "C.C",
        rh: "",
        eps: "",
        tallaTrenSuperior: "",
        tallaTrenInferior: "",
        nombreResponsable: "",
        equipo: "",
      });
      setTimeout(() => navigate("/clientes"), 2000);
    } catch (err) {
      setError("Error al crear el cliente: " + (err.response?.data?.message || "Error desconocido"));
    }
  };

  return (
    <div className="container mt-4">
      <h2>Crear Cliente</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingresa el nombre"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            placeholder="Ingresa el apellido"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ingresa el correo"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Ingresa el teléfono (10 dígitos)"
            required
            pattern="\d{10}"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Dirección</Form.Label>
          <Form.Control
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Ingresa la dirección"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Número de Identificación</Form.Label>
          <Form.Control
            type="text"
            name="numeroIdentificacion"
            value={formData.numeroIdentificacion}
            onChange={handleChange}
            placeholder="Ingresa el número de identificación"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Fecha de Nacimiento</Form.Label>
          <Form.Control
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Eliminamos campo de edad manual, ya se calcula */}

        <Form.Group className="mb-3">
          <Form.Label>Tipo de Documento</Form.Label>
          <Form.Select
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
            required
          >
            <option value="C.C">C.C</option>
            <option value="T.I">T.I</option>
            <option value="RC">RC</option>
            <option value="PPT">PPT</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>RH</Form.Label>
          <Form.Control
            type="text"
            name="rh"
            value={formData.rh}
            onChange={handleChange}
            placeholder="Ingresa el RH (ej. A+, O-)"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>EPS</Form.Label>
          <Form.Control
            type="text"
            name="eps"
            value={formData.eps}
            onChange={handleChange}
            placeholder="Ingresa la EPS"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Talla Tren Superior</Form.Label>
          <Form.Control
            type="text"
            name="tallaTrenSuperior"
            value={formData.tallaTrenSuperior}
            onChange={handleChange}
            placeholder="Ingresa la talla (ej. S, M, L)"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Talla Tren Inferior</Form.Label>
          <Form.Control
            type="text"
            name="tallaTrenInferior"
            value={formData.tallaTrenInferior}
            onChange={handleChange}
            placeholder="Ingresa la talla (ej. S, M, L)"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nombre Responsable</Form.Label>
          <Form.Control
            type="text"
            name="nombreResponsable"
            value={formData.nombreResponsable}
            onChange={handleChange}
            placeholder="Ingresa el nombre del responsable"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Equipo</Form.Label>
          <Form.Select
            name="equipo"
            value={formData.equipo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un equipo</option>
            {equipos.map((equipo, index) => (
              <option key={index} value={equipo}>
                {equipo}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Estado</Form.Label>
          <Form.Select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Crear Cliente
        </Button>
      </Form>
    </div>
  );
};

export default CrearCliente;
