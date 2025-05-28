import React, { useState } from "react";
import "../styles/Clientes.css"; 
import logo from "../assets/Logo G.png";
import { useNavigate } from "react-router-dom";

// URL de la API configurable mediante variable de entorno
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api/customers";

const ClientForm = () => {
  const navigate = useNavigate();
  
  // State for form data
  const [formData, setFormData] = useState({
    NameStyle: false,
    Title: "",
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Suffix: "",
    CompanyName: "",
    SalesPerson: "",
    EmailAddress: "",
    Phone: "",
    PasswordHash: "",
    PasswordSalt: ""
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBack = () => {
    navigate("/DatosClientes");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(""); // Resetear mensaje previo

    // Validación de campos obligatorios
    if (!formData.FirstName || !formData.LastName || !formData.EmailAddress) {
      setMessage("⚠️ Por favor, completa todos los campos obligatorios (Nombre, Apellido y Email).");
      setTimeout(() => setMessage(""), 3000);
      setIsLoading(false);
      return;
    }

    // Validación de formato de email
    if (!/^\S+@\S+\.\S+$/.test(formData.EmailAddress)) {
      setMessage("⚠️ Por favor, introduce un email válido.");
      setTimeout(() => setMessage(""), 3000);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Manejar respuesta no exitosa
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();

      setMessage("✅ Cliente creado correctamente.");
      setTimeout(() => setMessage(""), 3000);

      // Resetear formulario
      setFormData({
        NameStyle: false,
        Title: "",
        FirstName: "",
        MiddleName: "",
        LastName: "",
        Suffix: "",
        CompanyName: "",
        SalesPerson: "",
        EmailAddress: "",
        Phone: "",
        PasswordHash: "",
        PasswordSalt: ""
      });
    } catch (error) {
      console.error("Error:", error);
      setMessage(`❌ ${error.message || "Error al crear el cliente."}`);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container" data-testid="client-form-container">
      <aside className="left-sidebar">
        <img src={logo} alt="Logo" className="logo" data-testid="logo-image" />
        <button 
          className="back-button" 
          onClick={handleBack}
          data-testid="back-button"
        >
          Volver
        </button>
      </aside>

      <main className="form-box">
        <h2 className="form-title" data-testid="form-title">Formulario Clientes</h2>

        {message && (
          <p 
            className={`confirmation-message ${message.includes("✅") ? "success" : "error"}`}
            data-testid="message-alert"
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="form-grid" data-testid="client-form">
          {/* Left form section */}
          <div className="form-section">
            <label className="form-label">
              <input 
                type="checkbox" 
                name="NameStyle" 
                checked={formData.NameStyle} 
                onChange={handleChange} 
                className="form-checkbox" 
                data-testid="name-style-checkbox"
              />
              NameStyle
            </label>

            <label className="form-label">Título</label>
            <input 
              type="text" 
              name="Title" 
              value={formData.Title} 
              onChange={handleChange} 
              className="form-input" 
              placeholder="Ej: Sr., Sra., Dr."
              data-testid="title-input"
            />

            <label className="form-label">Primer Nombre*</label>
            <input 
              type="text" 
              name="FirstName" 
              value={formData.FirstName} 
              onChange={handleChange} 
              required 
              className="form-input" 
              placeholder="Ej: Juan"
              data-testid="first-name-input"
            />

            <label className="form-label">Segundo Nombre</label>
            <input 
              type="text" 
              name="MiddleName" 
              value={formData.MiddleName} 
              onChange={handleChange} 
              className="form-input" 
              placeholder="Ej: Carlos"
              data-testid="middle-name-input"
            />

            <label className="form-label">Apellidos*</label>
            <input 
              type="text" 
              name="LastName" 
              value={formData.LastName} 
              onChange={handleChange} 
              required 
              className="form-input" 
              placeholder="Ej: Pérez López"
              data-testid="last-name-input"
            />

            <label className="form-label">Sufijo</label>
            <input 
              type="text" 
              name="Suffix" 
              value={formData.Suffix} 
              onChange={handleChange} 
              className="form-input" 
              placeholder="Ej: Jr., Sr., III"
              data-testid="suffix-input"
            />
          </div>

          {/* Right form section */}
          <div className="form-section">
            <label className="form-label">Compañía</label>
            <input 
              type="text" 
              name="CompanyName" 
              value={formData.CompanyName} 
              onChange={handleChange} 
              className="form-input" 
              placeholder="Nombre de la empresa"
              data-testid="company-name-input"
            />

            <label className="form-label">Vendedor</label>
            <input 
              type="text" 
              name="SalesPerson" 
              value={formData.SalesPerson} 
              onChange={handleChange} 
              className="form-input" 
              placeholder="Representante de ventas"
              data-testid="sales-person-input"
            />

            <label className="form-label">Email*</label>
            <input 
              type="email" 
              name="EmailAddress" 
              value={formData.EmailAddress} 
              onChange={handleChange} 
              required 
              className="form-input" 
              placeholder="Ej: ejemplo@correo.com"
              data-testid="email-input"
            />

            <label className="form-label">Teléfono</label>
            <input 
              type="tel" 
              name="Phone" 
              value={formData.Phone} 
              onChange={handleChange} 
              className="form-input" 
              placeholder="Ej: 3001234567"
              data-testid="phone-input"
            />

            <label className="form-label">Password Hash</label>
            <input 
              type="password" 
              name="PasswordHash" 
              value={formData.PasswordHash} 
              onChange={handleChange} 
              className="form-input" 
              placeholder="Contraseña hasheada"
              data-testid="password-hash-input"
            />

            <label className="form-label">Password Salt</label>
            <input 
              type="password" 
              name="PasswordSalt" 
              value={formData.PasswordSalt} 
              onChange={handleChange} 
              className="form-input" 
              placeholder="Salt para la contraseña"
              data-testid="password-salt-input"
            />
          </div>

          {/* Submit button */}
          <div className="submit-button">
            <button 
              type="submit" 
              className="button" 
              disabled={isLoading}
              data-testid="submit-button"
            >
              {isLoading ? "Creando..." : "Crear Cliente"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ClientForm;