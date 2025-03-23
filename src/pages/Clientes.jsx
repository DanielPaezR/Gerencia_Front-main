import React, { useState } from "react";
import "../styles/Clientes.css"; 
import logo from "../assets/Logo G.png";

const ClientForm = () => {
  const [formData, setFormData] = useState({
    idNumber: "",
    firstName: "",
    secondName: "",
    firstSurname: "",
    secondSurname: "",
    email: "",
    phoneNumber: "",
    modificationDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que los campos obligatorios no estén vacíos
    if (!formData.idNumber || !formData.firstName || !formData.firstSurname || !formData.secondSurname || !formData.email || !formData.phoneNumber) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Guardar datos en LocalStorage (simulación de base de datos)
    localStorage.setItem("clienteData", JSON.stringify(formData));

    // Mostrar mensaje de éxito
    alert("Cliente guardado correctamente.");

    // Reiniciar el formulario después de guardar
    setFormData({
      idNumber: "",
      firstName: "",
      secondName: "",
      firstSurname: "",
      secondSurname: "",
      email: "",
      phoneNumber: "",
      modificationDate: "",
    });
  };

  return (
    <div className="form-container">
      {/* Barra lateral */}
      <aside className="left-sidebar">
        <img src={logo} alt="Logo" className="logo" />
      </aside>

      {/* Formulario */}
      <main className="form-box">
        <h2 className="form-title">Formulario Clientes</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-section">
            <label className="form-label">Identificación del Cliente</label>
            <input name="idNumber" value={formData.idNumber} onChange={handleChange} required className="form-input" />

            <label className="form-label">Primer Nombre</label>
            <input name="firstName" value={formData.firstName} onChange={handleChange} required className="form-input" />

            <label className="form-label">Segundo Nombre</label>
            <input name="secondName" value={formData.secondName} onChange={handleChange} className="form-input" />

            <label className="form-label">Primer Apellido</label>
            <input name="firstSurname" value={formData.firstSurname} onChange={handleChange} required className="form-input" />
          </div>
          <div className="form-section">
            <label className="form-label">Segundo Apellido</label>
            <input name="secondSurname" value={formData.secondSurname} onChange={handleChange} required className="form-input" />

            <label className="form-label">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" />

            <label className="form-label">Número de Teléfono</label>
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="form-input" />

            <label className="form-label">Fecha de Modificación</label>
            <input type="date" name="modificationDate" value={formData.modificationDate} onChange={handleChange} className="form-input" />
          </div>

          <div className="submit-button">
            <button type="submit">Guardar</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ClientForm;
