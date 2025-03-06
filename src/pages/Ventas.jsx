import { useNavigate } from "react-router-dom";
import "../styles/Ventas.css";
import logo from "../assets/Logo G.png";

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
  { nombre: "Bicicleta Montaña", img: img1, estrellas: 4, descripcion: "Ideal para terrenos difíciles y aventuras extremas.", precio: "$750" },
  { nombre: "Bicicleta Urbana", img: img2, estrellas: 5, descripcion: "Perfecta para moverte con estilo en la ciudad.", precio: "$620" },
  { nombre: "Bicicleta de Ruta", img: img3, estrellas: 4, descripcion: "Ligera y veloz para largas distancias.", precio: "$890" },
  { nombre: "Bicicleta BMX", img: img4, estrellas: 5, descripcion: "Diseñada para acrobacias y adrenalina pura.", precio: "$540" },
  { nombre: "Cadena reforzada", img: img5, estrellas: 4, descripcion: "Máxima seguridad para tu bicicleta.", precio: "$35" },
  { nombre: "Casco profesional", img: img6, estrellas: 5, descripcion: "Protección y comodidad en cada viaje.", precio: "$120" },
  { nombre: "Luz trasera LED", img: img7, estrellas: 4, descripcion: "Visibilidad y seguridad en la noche.", precio: "$25" },
  { nombre: "Inflador portátil", img: img8, estrellas: 5, descripcion: "Nunca te quedarás sin aire en el camino.", precio: "$45" }
];

const Ventas = () => {
  const navigate = useNavigate();

  return (
    <div className="ventas-container">
      {/* Barra de navegación */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="logo-ventas" />
          <div className="search-bar">
            <input type="text" placeholder="Buscar productos..." />
          </div>
        </div>
        <div className="auth-buttons">
          <button onClick={() => navigate("/login")}>Iniciar sesión</button>
          <button className="register-btn">Registrarse</button>
        </div>
      </nav>

      {/* Descripción de la sección */}
      <div className="section-description">
        <h2>🚴‍♂️ Ventas de Bicicletas 🚴‍♀️</h2>
        <p>Encuentra la bicicleta y accesorios perfectos para tus aventuras sobre ruedas.  
        ¡Explora y elige la tuya!</p>
      </div>

      {/* Sección de productos */}
      <div className="main-content">
        <div className="products-grid">
          {productos.map((producto, index) => (
            <div key={index} className="product">
              <img src={producto.img} alt={producto.nombre} />
              <h3>{producto.nombre}</h3>
              <p className="description">{producto.descripcion}</p>
              <p className="price">{producto.precio}</p>
              <div className="stars">{'★'.repeat(producto.estrellas)}{'☆'.repeat(5 - producto.estrellas)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ventas;
