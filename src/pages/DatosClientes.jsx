  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import '../styles/DatosClientes.css';
  import logo from "../assets/Logo G.png";
  import viewIcon from "../assets/visualizar.png";
  import editIcon from "../assets/editar.png";
  import searchIcon from "../assets/search.png";
  import deleteIcon from "../assets/eliminar.png";

  const DatosClientes = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    // Obtener clientes
    useEffect(() => {
      const fetchCustomers = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/customers');
          if (!response.ok) {
            throw new Error('Error al obtener clientes');
          }
          const data = await response.json();
          setCustomers(data.result || data);
          setFilteredCustomers(data.result || data); // Inicializar clientes filtrados
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchCustomers();
    }, []);

    // Filtrar clientes cuando cambia el término de búsqueda
    useEffect(() => {
      if (searchTerm === "") {
        setFilteredCustomers(customers);
      } else {
        const filtered = customers.filter(customer => {
          const term = searchTerm.toLowerCase();
          return (
            customer.CustomerID.toString().toLowerCase().includes(term) ||
            (customer.FirstName && customer.FirstName.toLowerCase().includes(term)) ||
            (customer.MiddleName && customer.MiddleName.toLowerCase().includes(term)) ||
            (customer.LastName && customer.LastName.toLowerCase().includes(term)) ||
            (customer.EmailAddress && customer.EmailAddress.toLowerCase().includes(term)) ||
            (customer.CompanyName && customer.CompanyName.toLowerCase().includes(term))
          );
        });
        setFilteredCustomers(filtered);
      }
    }, [searchTerm, customers]);

    // Eliminar cliente
    const handleDelete = async (customerId) => {
      if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
        try {
          const response = await fetch(`http://localhost:3000/api/customers/${customerId}`, {
            method: 'DELETE'
          });

          if (!response.ok) {
            throw new Error('Error al eliminar cliente');
          }

          // Actualizar lista de clientes
          const updatedCustomers = customers.filter(customer => customer.CustomerID !== customerId);
          setCustomers(updatedCustomers);
        } catch (err) {
          setError(err.message);
        }
      }
    };

    // Mostrar detalles del cliente
    const handleView = (customer) => {
      setSelectedCustomer(customer);
      setShowModal(true);
    };

    // Editar cliente
    const handleEdit = (customerId) => {
      navigate(`/CustomerEditForm/${customerId}`);
    };

    const handleBack = () => {
      navigate("/ventas");
    };

    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value); // Actualiza el estado con el valor del input
    };

    const handleAddClient = () => {
      console.log("Añadir nuevo cliente");
      navigate("/clientes");
    };

    const [message, setMessage] = useState("");

    if (loading) return <div className="loading">Cargando clientes...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
      <div className="datosClientes-container">
        <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="logo-ventas" />
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm} 
              onChange={handleSearchChange} // Usa la función corregida
            />
          </div>
        </div>
      </nav>

        <aside className="left-sidebar-DatosClientes">
          <img src={logo} alt="Logo" className="logo" />
          <button className="add-client-button" onClick={handleAddClient}>
          Añadir Cliente
          </button>
          <button className="back-button" onClick={handleBack}>Volver</button>
        </aside>

        <h1>Gestión de Clientes</h1>

        {message && (
          <p className={`confirmation-message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}
        
        <div className="client-cards-grid">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <div key={customer.CustomerID} className="client-card">
                <div className="client-details">
                  <div className="client-id">ID {customer.CustomerID}</div>
                  <div className="client-name">
                    {customer.FirstName} {customer.LastName}
                  </div>
                  <p>{customer.CompanyName || 'Sin compañía'}</p>
                  <div className="client-email">{customer.EmailAddress}</div>
                  <div className="client-phone">{customer.Phone || 'No especificado'}</div>
                </div>
                
                <div className="client-actions">
                  <button 
                    onClick={() => handleView(customer)} 
                    className="action-button view-button"
                  >
                    <img src={viewIcon} alt="View" />
                  </button>
                  <button 
                    onClick={() => handleEdit(customer.CustomerID)} 
                    className="action-button edit-button"
                  >
                    <img src={editIcon} alt="Edit" />
                  </button>
                  <button 
                    onClick={() => handleDelete(customer.CustomerID)} 
                    className="action-button delete-button"
                  >
                    <img src={deleteIcon} alt="Delete" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              No se encontraron clientes que coincidan con la búsqueda
            </div>
          )}
        </div>

        {/* Modal para ver detalles */}
        {showModal && selectedCustomer && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close-modal" onClick={() => setShowModal(false)}>&times;</span>
              <h2>Detalles del Cliente</h2>
              <div className="modal-details">
                <p><strong>Nombre:</strong> {selectedCustomer.Title} {selectedCustomer.FirstName} {selectedCustomer.MiddleName} {selectedCustomer.LastName} {selectedCustomer.Suffix}</p>
                <p><strong>Compañía:</strong> {selectedCustomer.CompanyName || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedCustomer.EmailAddress}</p>
                <p><strong>Teléfono:</strong> {selectedCustomer.Phone || 'N/A'}</p>
                <p><strong>Vendedor:</strong> {selectedCustomer.SalesPerson || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default DatosClientes;
