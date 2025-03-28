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

  // Aplicar filtros automáticamente cuando cambien los productos, filtros o término de búsqueda
  useEffect(() => {
    aplicarFiltrosYBusqueda(filtros, searchTerm);
  }, [productos, filtros, searchTerm]);

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
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const checkPriceRange = (price, range) => {
    if (!range) return true;
    
    const [min, max] = range.split(/-|\+/);
    const priceNum = parseFloat(price);
    
    if (range.endsWith('+')) {
      return priceNum >= parseFloat(min);
    }
    
    return priceNum >= parseFloat(min) && 
           (max ? priceNum <= parseFloat(max) : true);
  };

  const aplicarFiltrosYBusqueda = (filters, term) => {
    const filtered = productos.filter((producto) => {
      // Filtro por ID de categoría (búsqueda exacta)
      const categoryMatch = !filters.category || 
                          producto.ProductCategoryID?.toString().includes(filters.category.toString());
  
      // Filtro por precio (se mantiene igual)
      const priceMatch = !filters.price || 
                        checkPriceRange(producto.ListPrice, filters.price);
      
      // Filtro por marca (búsqueda textual)
      const brandMatch = !filters.brand || 
                        producto.Name?.toLowerCase().includes(filters.brand.toLowerCase()) ||
                        (producto.ProductModel && 
                         producto.ProductModel.toLowerCase().includes(filters.brand.toLowerCase()));
  
      // Búsqueda general
      const searchMatch = !term || 
                         producto.Name?.toLowerCase().includes(term.toLowerCase()) ||
                         (producto.ProductNumber && 
                          producto.ProductNumber.toLowerCase().includes(term.toLowerCase()));
  
      return categoryMatch && priceMatch && brandMatch && searchMatch;
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
            <div 
              key={producto.ProductNumber} 
              className="product" 
              onClick={() => abrirModal(producto)} 
              style={{ cursor: 'pointer' }}
            >
              <img 
                src={producto.ThumbNailPhoto ? 
                  `data:image/jpeg;base64,${btoa(String.fromCharCode(...producto.ThumbNailPhoto.data))}` : 
                  '../assets/Logo G.png'
                } 
                alt={producto.Name}
                onError={(e) => {
                  e.target.src = '../assets/Logo G.png';
                  e.target.onerror = null;
                }}
              />
              <h2 className="name">{producto.Name}</h2>
              <p className="price">${producto.ListPrice}</p>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && productoSeleccionado && (
        <div 
          className="modal-overlay" 
          onClick={cerrarModal} 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            backgroundColor: 'rgba(0, 0, 0, 0.7)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}
        >
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '10px', 
              maxWidth: '500px', 
              textAlign: 'center', 
              position: 'relative' 
            }}
          >
            <span className="close-button" onClick={cerrarModal}>&times;</span>
            <img 
              src={productoSeleccionado.ThumbNailPhoto ? 
                `data:image/jpeg;base64,${btoa(String.fromCharCode(...productoSeleccionado.ThumbNailPhoto.data))}` : 
                '../assets/Logo G.png'
              } 
              alt={productoSeleccionado.Name}
              onError={(e) => {
                e.target.src = '../assets/Logo G.png';
                e.target.onerror = null;
              }}
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