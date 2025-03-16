import { useState } from "react";
import "../styles/Ventas.css";
import logo from "../assets/Logo G.png";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Importa el componente Sidebar

// Importar las imágenes
import img1 from "../assets/B1.jpg";
import img2 from "../assets/B2.jpg";
import img3 from "../assets/B3.jpg";
import img4 from "../assets/B45.jpg";
import img5 from "../assets/B5.jpg";
import img6 from "../assets/B6.jpg";
import img7 from "../assets/B7.jpg";
import img8 from "../assets/B8.jpg";

// Productos con nombre, imagen, descripción, precios y estrellas dinámicas
const productos = [
  { nombre: "Bicicleta Montaña", img: img1, descripcion: "Ideal para terrenos difíciles y aventuras extremas.", precio: 750, categoria: "bicicletas", marca: "Montaña" },
  { nombre: "Bicicleta Urbana", img: img2, descripcion: "Perfecta para moverte con estilo en la ciudad.", precio: 620, categoria: "bicicletas", marca: "Urbana" },
  { nombre: "Bicicleta de Ruta", img: img3, descripcion: "Ligera y veloz para largas distancias.", precio: 890, categoria: "bicicletas", marca: "Ruta" },
  { nombre: "Bicicleta BMX", img: img4, descripcion: "Diseñada para acrobacias y adrenalina pura.", precio: 540, categoria: "bicicletas", marca: "BMX" },
  { nombre: "Cadena reforzada", img: img5, descripcion: "Máxima seguridad para tu bicicleta.", precio: 35, categoria: "accesorios", marca: "Seguridad" },
  { nombre: "Casco profesional", img: img6, descripcion: "Protección y comodidad en cada viaje.", precio: 120, categoria: "accesorios", marca: "Protección" },
  { nombre: "Luz trasera LED", img: img7, descripcion: "Visibilidad y seguridad en la noche.", precio: 25, categoria: "accesorios", marca: "Iluminación" },
  { nombre: "Inflador portátil", img: img8, descripcion: "Nunca te quedarás sin aire en el camino.", precio: 45, categoria: "accesorios", marca: "Herramientas" }
];

const Ventas = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [filtros, setFiltros] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [productosFiltrados, setProductosFiltrados] = useState(productos);

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
    aplicarFiltrosYBusqueda(filtros, term);
  };

  const aplicarFiltrosYBusqueda = (filters, term) => {
    const filtered = productos.filter((producto) => {
      const cumpleFiltros =
        (filters.category ? producto.categoria === filters.category : true) &&
        (filters.price ? checkPriceRange(producto.precio, filters.price) : true) &&
        (filters.brand ? producto.marca.toLowerCase().includes(filters.brand.toLowerCase()) : true);

      const cumpleBusqueda = term
        ? producto.nombre.toLowerCase().includes(term.toLowerCase())
        : true;

      return cumpleFiltros && cumpleBusqueda;
    });
    setProductosFiltrados(filtered);
  };

  const checkPriceRange = (price, range) => {
    const [min, max] = range.split("-");
    if (max === "+") return price >= parseInt(min);
    return price >= parseInt(min) && price <= parseInt(max);
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
              onChange={handleSearch} // Maneja la búsqueda
            />
          </div>
        </div>
      </nav>

      <div className="main-content">
        <Sidebar onFilter={handleFilter} /> {/* Barra lateral de filtros */}
        <div className="content">
          <div className="section-description">
            <h2>🚴‍♂️ Ventas de Bicicletas 🚴‍♀️</h2>
            <p>Encuentra la bicicleta y accesorios perfectos para tus aventuras sobre ruedas. ¡Explora y elige la tuya!</p>
          </div>

          <h1>Productos en Venta</h1>
          <div className="products-grid">
            {productosFiltrados.map((producto, index) => (
              <div key={index} className="product" onClick={() => abrirModal(producto)} style={{ cursor: 'pointer' }}>
                <img src={producto.img} alt={producto.nombre} />
                <h2 className="name">{producto.nombre}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalOpen && productoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', maxWidth: '400px', textAlign: 'center', position: 'relative' }}>
            <span className="close-button" onClick={cerrarModal}>&times;</span>
            <img src={productoSeleccionado.img} alt={productoSeleccionado.nombre} style={{ width: '100%', borderRadius: '10px' }} />
            <h2 className="name">{productoSeleccionado.nombre}</h2>
            <p className="description">{productoSeleccionado.descripcion}</p>
            <p className="price">${productoSeleccionado.precio}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ventas;