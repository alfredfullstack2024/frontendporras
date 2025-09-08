import React, { useState } from "react";
import axios from "axios";

const CrearCliente = () => {
  const [formData, setFormData] = useState({
    numeroIdentificacion: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    fechaNacimiento: "",
    tipoDocumento: "C.C",
    rh: "",
    eps: "",
    tallaTrenSuperior: "",
    tallaTrenInferior: "",
    nombreResponsable: "",
    direccion: "",
    estado: "activo",
    equipo: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        ...formData,
        fechaNacimiento: new Date(formData.fechaNacimiento),
      };

      const res = await axios.post("http://localhost:5000/api/clientes", dataToSend);
      alert("✅ Cliente creado correctamente");
      console.log(res.data);
    } catch (error) {
      console.error("❌ Error en la respuesta del servidor:", error.response?.data || error);
      alert("Error al crear cliente: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="container mt-4">
      <h2>Crear Cliente</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Número de Identificación</label>
          <input type="text" className="form-control" name="numeroIdentificacion" value={formData.numeroIdentificacion} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Nombre</label>
          <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Apellido</label>
          <input type="text" className="form-control" name="apellido" value={formData.apellido} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Teléfono</label>
          <input type="text" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Fecha de Nacimiento</label>
          <input type="date" className="form-control" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Tipo de Documento</label>
          <select className="form-control" name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange}>
            <option value="C.C">C.C</option>
            <option value="T.I">T.I</option>
            <option value="RC">RC</option>
            <option value="PPT">PPT</option>
          </select>
        </div>

        <div className="mb-3">
          <label>RH</label>
          <input type="text" className="form-control" name="rh" value={formData.rh} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>EPS</label>
          <input type="text" className="form-control" name="eps" value={formData.eps} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Talla Tren Superior</label>
          <input type="text" className="form-control" name="tallaTrenSuperior" value={formData.tallaTrenSuperior} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Talla Tren Inferior</label>
          <input type="text" className="form-control" name="tallaTrenInferior" value={formData.tallaTrenInferior} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Nombre del Responsable</label>
          <input type="text" className="form-control" name="nombreResponsable" value={formData.nombreResponsable} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Dirección</label>
          <input type="text" className="form-control" name="direccion" value={formData.direccion} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Equipo</label>
          <input type="text" className="form-control" name="equipo" value={formData.equipo} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Estado</label>
          <select className="form-control" name="estado" value={formData.estado} onChange={handleChange}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Crear Cliente</button>
      </form>
    </div>
  );
};

export default CrearCliente;
