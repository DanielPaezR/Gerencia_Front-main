import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CustomerEditForm.css'; // Asegúrate de crear este archivo CSS

const CustomerEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    NameStyle: false,
    Title: '',
    FirstName: '',
    MiddleName: '',
    LastName: '',
    Suffix: '',
    CompanyName: '',
    SalesPerson: '',
    EmailAddress: '',
    Phone: '',
    PasswordHash: '',
    PasswordSalt: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Obtener datos del cliente
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/customers/${id}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data) {
          throw new Error('No se recibieron datos del cliente');
        }
        
        setFormData({
          NameStyle: data.NameStyle || false,
          Title: data.Title || '',
          FirstName: data.FirstName || '',
          MiddleName: data.MiddleName || '',
          LastName: data.LastName || '',
          Suffix: data.Suffix || '',
          CompanyName: data.CompanyName || '',
          SalesPerson: data.SalesPerson || '',
          EmailAddress: data.EmailAddress || '',
          Phone: data.Phone || '',
          PasswordHash: data.PasswordHash || '',
          PasswordSalt: data.PasswordSalt || ''
        });
        
      } catch (err) {
        console.error('Error al cargar cliente:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Validación básica
      if (!formData.FirstName || !formData.LastName || !formData.EmailAddress) {
        throw new Error('Nombre, apellido y email son campos requeridos');
      }

      const response = await fetch(`http://localhost:3000/api/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar cliente');
      }

      setSuccessMessage('Cliente actualizado correctamente');
      setTimeout(() => navigate('/customers'), 1500); // Redirigir después de 1.5 segundos
      
    } catch (err) {
      console.error('Error al actualizar:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Cargando datos del cliente...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <h2>Error</h2>
      <p>{error}</p>
      <button onClick={() => navigate('/customers')}>Volver a la lista</button>
    </div>
  );

  return (
    <div className="edit-form-container">
      <h2>Editar Cliente ID: {id}</h2>
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                name="NameStyle" 
                checked={formData.NameStyle} 
                onChange={handleChange} 
              />
              NameStyle
            </label>
          </div>

          <div className="form-group">
            <label>Título:</label>
            <input
              type="text"
              name="Title"
              value={formData.Title}
              onChange={handleChange}
              placeholder="Ej: Sr., Sra., Dr."
            />
          </div>

          <div className="form-group">
            <label>Primer Nombre*:</label>
            <input
              type="text"
              name="FirstName"
              value={formData.FirstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Segundo Nombre:</label>
            <input
              type="text"
              name="MiddleName"
              value={formData.MiddleName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Apellidos*:</label>
            <input
              type="text"
              name="LastName"
              value={formData.LastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Sufijo:</label>
            <input
              type="text"
              name="Suffix"
              value={formData.Suffix}
              onChange={handleChange}
              placeholder="Ej: Jr., Sr., III"
            />
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label>Compañía:</label>
            <input
              type="text"
              name="CompanyName"
              value={formData.CompanyName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Vendedor:</label>
            <input
              type="text"
              name="SalesPerson"
              value={formData.SalesPerson}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email*:</label>
            <input
              type="email"
              name="EmailAddress"
              value={formData.EmailAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono:</label>
            <input
              type="tel"
              name="Phone"
              value={formData.Phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password Hash:</label>
            <input
              type="password"
              name="PasswordHash"
              value={formData.PasswordHash}
              onChange={handleChange}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Password Salt:</label>
            <input
              type="password"
              name="PasswordSalt"
              value={formData.PasswordSalt}
              onChange={handleChange}
              disabled
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="save-btn"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/customers')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerEditForm;