import { useState, useEffect } from "react";
import "../styles/Ventas.css";
import logo from "../assets/Logo G.png";
import Sidebar from "../components/Sidebar";

const Ventas = () => {

  const [modalOpen, setModalOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setProductos(data.result);
          setProductosFiltrados(data.result);
        }
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  const abrirModal = (producto) => {
    setProductoSeleccionado(producto);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setTimeout(() => setProductoSeleccionado(null), 300);
  };

  const handleFilter = (filters) => {
    setFiltros(filters);
    aplicarFiltrosYBusqueda(filters, searchTerm);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    aplicarFiltrosYBusqueda(filter, term);
  };

  const checkPriceRange = (price, range) => {
    const [min, max] = range.split("-");
    if (max === "+") return price >= parseInt(min);
    return price >= parseInt(min) && price <= parseInt(max);
  };

  const aplicarFiltrosYBusqueda = (filters, term) => {
    const filtered = productos.filter((producto) => {
      const cumpleFiltros =
        (filters.category ? producto.ProductCategoryID === filters.category : true) &&
        (filters.price ? checkPriceRange(producto.ListPrice, filters.price) : true) &&
        (filters.brand ? producto.ProductModelID === filters.brand : true);

      const cumpleBusqueda = term
        ? producto.Name.toLowerCase().includes(term.toLowerCase())
        : true;

      return cumpleFiltros && cumpleBusqueda;
    });
    setProductosFiltrados(filtered);
  };

  

  return (
    <div className="ventas-container">
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="logo-ventas" />
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </nav>

      
        <Sidebar onFilter={handleFilter} />
        <div className="content">
          <h1>Gestión De Productos</h1>
          <div className="products-grid">
            {productosFiltrados.map((producto) => (
              <div key={producto.ProductNumber} className="product" onClick={() => abrirModal(producto)} style={{ cursor: 'pointer' }}>
                <img 
                  src={`data:image/jpeg;base64,${btoa(String.fromCharCode(...producto.ThumbNailPhoto.data))}`} 
                  alt={producto.Name}
                  onError={(e) => e.target.src = '../assets/Logo G.png'}
                />
                <h2 className="name">{producto.Name}</h2>
              </div>
            ))}
          </div>
        </div>
     

      {modalOpen && productoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', maxWidth: '500px', textAlign: 'center', position: 'relative' }}>
            <span className="close-button" onClick={cerrarModal}>&times;</span>
            <img 
              src={`data:image/jpeg;base64,${btoa(String.fromCharCode(...productoSeleccionado.ThumbNailPhoto.data))}`} 
              alt={productoSeleccionado.Name}
              onError={(e) => e.target.src = '../assets/Logo G.png'}
              style={{ width: '400px', borderRadius: '10px' }}
            />
            <h2 className="name">{productoSeleccionado.Name}</h2>
            <p className="price">${productoSeleccionado.ListPrice}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ventas;