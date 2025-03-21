import React from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/DatosClientes.css";
import logo from "../assets/Logo G.png"; // Asegúrate de tener el logo correcto
import searchIcon from "../assets/search.png";
import viewIcon from "../assets/visualizar.png"; // Ícono de ojo para visualizar
import editIcon from "../assets/editar.png"; // Ícono de lápiz para editar
import deleteIcon from "../assets/eliminar.png"; // Ícono de papelera para eliminar
import clientesIcon from "../assets/clientes.png"; // Ícono para el menú de clientes
import productosIcon from "../assets/productos.png"; // Ícono para el menú de productos
import userIcon from "../assets/user.png"; // Ícono de usuario

const DatosClientes = () => {
  const navigate = useNavigate();

  const handleView = (id) => {
    console.log(`Ver cliente con ID: ${id}`);
    // Lógica para ver el cliente
  };

  const handleEdit = (id) => {
    console.log(`Editar cliente con ID: ${id}`);
    // Lógica para editar el cliente
  };

  const handleDelete = (id) => {
    console.log(`Eliminar cliente con ID: ${id}`);
    // Lógica para eliminar el cliente
  };

  const handleAddClient = () => {
    console.log("Añadir nuevo cliente");
    // Navegar a la página de añadir cliente
    // navigate("/agregar-cliente");
  };

  const handleMenuClick = (route) => {
    navigate(route);
  };

  // Datos de ejemplo para los clientes (todos con el mismo nombre como en la imagen)
  const clientes = Array(6).fill({ id: "122", nombre: "Laura Sofia Mora Ruiz" });

  return (
    <div className="main-container">
      <div className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="AllBike Logo" className="logo" />
        </div>
        <div className="menu-items">
          <div className="menu-item" onClick={() => handleMenuClick("/clientes")}>
            <img src={clientesIcon} alt="Clientes" className="menu-icon" />
            <span>CLIENTES</span>
          </div>
          <div className="menu-item" onClick={() => handleMenuClick("/AñadirProducto")}>
            <img src={productosIcon} alt="Productos" className="menu-icon" />
            <span>PRODUCTOS</span>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="content-header">
          <h1>DATOS CLIENTES</h1>
          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">Juan Perez</span>
              <span className="user-role">Admin</span>
            </div>
            <div className="user-avatar">
              <img src={userIcon} alt="User" />
            </div>
          </div>
        </div>

        <div className="search-container">
          <input 
            type="text" 
            placeholder="SEARCH ID" 
            className="search-input" 
          />
          <button className="search-button">
            <img src={searchIcon} alt="Search" />
          </button>
        </div>

        <div className="add-client-container">
          <button className="add-client-button" onClick={handleAddClient}>
            + Añadir Cliente
          </button>
        </div>

        <div className="client-cards-grid">
          {clientes.map((cliente, index) => (
            <div key={index} className="client-card">
              <div className="client-details">
                <div className="client-id">ID {cliente.id}</div>
                <div className="client-name">{cliente.nombre}</div>
              </div>
              <div className="client-actions">
                <button 
                  onClick={() => handleView(cliente.id)} 
                  className="action-button view-button"
                >
                  <img src={viewIcon} alt="View" />
                </button>
                <button 
                  onClick={() => handleEdit(cliente.id)} 
                  className="action-button edit-button"
                >
                  <img src={editIcon} alt="Edit" />
                </button>
                <button 
                  onClick={() => handleDelete(cliente.id)} 
                  className="action-button delete-button"
                >
                  <img src={deleteIcon} alt="Delete" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <span>Page</span>
          <button className="page-number active">1</button>
          <button className="page-number">2</button>
          <button className="page-number">3</button>
          <button className="page-number">4</button>
          <button className="page-number">5</button>
          <button className="next-page">
            <span>›</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatosClientes;
