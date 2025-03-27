import React, { useState } from "react";
import "../styles/Clientes.css"; 
import logo from "../assets/Logo G.png";
import { useNavigate } from "react-router-dom";

const ClientForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idNumber: "",
    firstName: "",
    secondName: "",
    firstSurname: "",
    secondSurname: "",
    emailAddress: "", // Cambio "email" a "emailAddress"
    phoneNumber: "",
    modificationDate: "",
  });

  const [message, setMessage] = useState(""); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleBack = () => {
    navigate("/DatosClientes");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.idNumber || !formData.firstName || !formData.firstSurname || !formData.emailAddress || !formData.phoneNumber) {
      setMessage("⚠️ Por favor, completa todos los campos obligatorios.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      const payload = {
        FirstName: formData.firstName,
        LastName: formData.firstSurname + (formData.secondSurname ? ` ${formData.secondSurname}` : ""),
        EmailAddress: formData.emailAddress,
        PhoneNumber: formData.phoneNumber,
      };

      const response = await fetch("http://localhost:3000/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error al guardar los datos.");
      }

      setMessage("✅ Cliente guardado correctamente.");
      setTimeout(() => setMessage(""), 3000);

      setFormData({
        idNumber: "",
        firstName: "",
        secondName: "",
        firstSurname: "",
        secondSurname: "",
        emailAddress: "",
        phoneNumber: "",
        modificationDate: "",
      });
    } catch (error) {
      setMessage("❌ Error al guardar el cliente.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="form-container">
      <aside className="left-sidebar">
        <img src={logo} alt="Logo" className="logo" />
        <button className="back-button" onClick={handleBack}>Volver</button>
      </aside>

      <main className="form-box">
        <h2 className="form-title">Formulario Clientes</h2>

        {message && <p className="confirmation-message">{message}</p>}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-section">
            <label className="form-label">Identificación del Cliente</label>
            <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} required className="form-input" />

            <label className="form-label">Primer Nombre</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="form-input" />

            <label className="form-label">Segundo Nombre</label>
            <input type="text" name="secondName" value={formData.secondName} onChange={handleChange} className="form-input" />

            <label className="form-label">Primer Apellido</label>
            <input type="text" name="firstSurname" value={formData.firstSurname} onChange={handleChange} required className="form-input" />
          </div>

          <div className="form-section">
            <label className="form-label">Segundo Apellido</label>
            <input type="text" name="secondSurname" value={formData.secondSurname} onChange={handleChange} className="form-input" />

            <label className="form-label">Email</label>
            <input type="email" name="emailAddress" value={formData.emailAddress} onChange={handleChange} required className="form-input" />

            <label className="form-label">Número de Teléfono</label>
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="form-input" />
          </div>

          <div className="submit-button">
            <button type="submit" className="button">Guardar</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ClientForm;