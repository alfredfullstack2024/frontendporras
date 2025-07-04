import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  obtenerPagoPorId,
  editarPago,
  obtenerClientes,
  obtenerProductos,
} from "../../api/axios";

const EditarPago = () => {
  const { id } = useParams();
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    cliente: "",
    producto: "",
    cantidad: 1,
    monto: "",
    fecha: "",
    metodoPago: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tiqueteConfig, setTiqueteConfig] = useState({
    nombreEstablecimiento: "GoldenGym Studio",
    direccion: "Carrera 123 # 65A 57",
    telefonos: "350 425 4643 - 350 555 4995",
    nit: "123456789",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [pagoResponse, clientesResponse, productosResponse] =
          await Promise.all([
            obtenerPagoPorId(id),
            obtenerClientes(),
            obtenerProductos(),
          ]);

        const pago = pagoResponse.data;
        setFormData({
          cliente: pago.cliente?._id || "",
          producto: pago.producto?._id || "",
          cantidad: pago.cantidad || 1,
          monto: pago.monto || "",
          fecha: pago.fecha
            ? new Date(pago.fecha).toISOString().split("T")[0]
            : "",
          metodoPago: pago.metodoPago || "Efectivo",
        });

        setClientes(clientesResponse.data);
        setProductos(productosResponse.data);
      } catch (err) {
        const errorMessage = err.response?.data?.mensaje || err.message;
        setError(
          errorMessage === "Pago no encontrado"
            ? "Error al cargar datos: Recurso no encontrado"
            : "Error al cargar datos: " + errorMessage
        );
        if (err.message.includes("Sesión expirada")) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  useEffect(() => {
    if (formData.producto && formData.cantidad) {
      const productoSeleccionado = productos.find(
        (prod) => prod._id === formData.producto
      );
      if (productoSeleccionado) {
        const nuevoMonto = productoSeleccionado.precio * formData.cantidad;
        setFormData((prev) => ({
          ...prev,
          monto: nuevoMonto.toString(),
        }));
      }
    }
  }, [formData.producto, formData.cantidad, productos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.producto) {
      const productoSeleccionado = productos.find(
        (prod) => prod._id === formData.producto
      );
      if (
        productoSeleccionado &&
        productoSeleccionado.stock < parseInt(formData.cantidad)
      ) {
        setError("Stock insuficiente para el producto seleccionado.");
        setIsLoading(false);
        return;
      }
    }

    const datosEnvio = {
      cliente: formData.cliente || undefined,
      producto: formData.producto || undefined,
      cantidad: parseInt(formData.cantidad),
      monto: parseFloat(formData.monto),
      fecha: formData.fecha || undefined,
      metodoPago: formData.metodoPago,
    };

    try {
      await editarPago(id, datosEnvio);
      generarTiquete();
      navigate("/pagos");
    } catch (err) {
      setError(
        "Error al actualizar el pago: " +
          (err.response?.data?.mensaje || err.message)
      );
      if (err.message.includes("Sesión expirada")) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generarTiquete = () => {
    const fechaFinal = new Date(formData.fecha);
    fechaFinal.setMonth(fechaFinal.getMonth() + 1);
    const tiqueteHTML = `
      <div style="width: 300px; font-family: Arial, sans-serif; padding: 10px;">
        <h1 style="text-align: center;">${tiqueteConfig.nombreEstablecimiento}</h1>
        <p style="text-align: center;">${tiqueteConfig.direccion}</p>
        <p style="text-align: center;">Tel: ${tiqueteConfig.telefonos} | NIT: ${tiqueteConfig.nit}</p>
        <p>Fecha: ${new Date().toLocaleDateString("es-CO")}</p>
        <p>Recibo #: ${Math.floor(Math.random() * 10000) + 1}</p>
        <p>Cliente: ${clientes.find((c) => c._id === formData.cliente)?.nombre || "No especificado"}</p>
        <h3>Mensualidad Gym 2025</h3>
        <p>Fecha Inicio: ${new Date(formData.fecha).toLocaleDateString("es-CO")}</p>
        <p>Fecha Final: ${fechaFinal.toLocaleDateString("es-CO")}</p>
        <p>Pago: ${parseFloat(formData.monto).toLocaleString("es-CO", { style: "currency", currency: "COP" })}</p>
        <p>Saldo: 0.00</p>
        <p>Forma Pago: ${formData.metodoPago}</p>
        <p style="font-size: 8px;">Mensualidad Intransferible, No Congelable, No Se Hace Devolución de Dinero</p>
      </div>
    `;

    const printWindow = window.open("", "", "height=500,width=300");
    printWindow.document.write("<html><head><title>Tiquete</title></head><body>");
    printWindow.document.write(tiqueteHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="container mt-4">
      <h2>Editar Pago</h2>

      {isLoading && <Alert variant="info">Cargando...</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="cliente">
              <Form.Label>Cliente (opcional)</Form.Label>
              <Form.Control
                as="select"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">Seleccione un cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente._id} value={cliente._id}>
                    {cliente.nombre} {cliente.apellido}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="producto">
              <Form.Label>Producto (opcional)</Form.Label>
              <Form.Control
                as="select"
                name="producto"
                value={formData.producto}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">Seleccione un producto</option>
                {productos.map((producto) => (
                  <option key={producto._id} value={producto._id}>
                    {producto.nombre} - ${producto.precio} ({producto.stock} en
                    stock)
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="cantidad">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                min="1"
                required
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="monto">
              <Form.Label>Monto</Form.Label>
              <Form.Control
                type="number"
                name="monto"
                value={formData.monto}
                onChange={handleChange}
                step="0.01"
                required
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="fecha">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="metodoPago">
              <Form.Label>Método de Pago</Form.Label>
              <Form.Control
                as="select"
                name="metodoPago"
                value={formData.metodoPago}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit" disabled={isLoading}>
              Actualizar Pago
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => navigate("/pagos")}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditarPago;
