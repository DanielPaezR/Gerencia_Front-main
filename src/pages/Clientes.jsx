import React, { useState } from "react";
import "../styles/Clientes.css"; 
import logo from "../assets/Logo G.png";
import { useNavigate } from "react-router-dom";

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

    // Validation
    if (!formData.FirstName || !formData.LastName || !formData.EmailAddress) {
      setMessage("⚠️ Por favor, completa todos los campos obligatorios (Nombre, Apellido y Email).");
      setTimeout(() => setMessage(""), 3000);
      setIsLoading(false);
      return;
    }

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(formData.EmailAddress)) {
      setMessage("⚠️ Por favor, introduce un email válido.");
      setTimeout(() => setMessage(""), 3000);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Error al guardar los datos.");
      }

      setMessage("✅ Cliente creado correctamente.");
      setTimeout(() => setMessage(""), 3000);

      // Reset form
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
    <div className="form-container">
      <aside className="left-sidebar">
        <img src={logo} alt="Logo" className="logo" />
        <button className="back-button" onClick={handleBack}>Volver</button>
      </aside>

      <main className="form-box">
        <h2 className="form-title">Formulario Clientes</h2>

        {message && (
          <p className={`confirmation-message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          {/* Left form section */}
          <div className="form-section">
            <label className="form-label">
              <input 
                type="checkbox" 
                name="NameStyle" 
                checked={formData.NameStyle} 
                onChange={handleChange} 
                className="form-checkbox" 
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
            />

            <label className="form-label">Segundo Nombre</label>
            <input 
              type="text" 
              name="MiddleName" 
              value={formData.MiddleName} 
              onChange={handleChange} 
              className="form-input" 
              placeholder="Ej: Carlos"
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
            />

            <label className="form-label">Sufijo</label>
            <input 
              type="text" 
              name="Suffix" 
              value={formData.Suffix} 
              onChange={handleChange} 
              className="form-input" 
              placeholder="Ej: Jr., Sr., III"
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
            />

            <label className="form-label">Vendedor</label>
            <input 
              type="text" 
              name="SalesPerson" 
              value={formData.SalesPerson} 
              onChange={handleChange} 
              className="form-input" 
              placeholder="Representante de ventas"
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
            />

            <label className="form-label">Teléfono</label>
            <input 
              type="tel" 
              name="Phone" 
              value={formData.Phone} 
              onChange={handleChange} 
              className="form-input" 
              placeholder="Ej: 3001234567"
            />

            <label className="form-label">Password Hash</label>
            <input 
              type="password" 
              name="PasswordHash" 
              value={formData.PasswordHash} 
              onChange={handleChange} 
              className="form-input" 
              placeholder="Contraseña hasheada"
            />

            <label className="form-label">Password Salt</label>
            <input 
              type="password" 
              name="PasswordSalt" 
              value={formData.PasswordSalt} 
              onChange={handleChange} 
              className="form-input" 
              placeholder="Salt para la contraseña"
            />
          </div>

          {/* Submit button */}
          <div className="submit-button">
            <button 
              type="submit" 
              className="button" 
              disabled={isLoading}
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