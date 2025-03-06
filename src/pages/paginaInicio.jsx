import { useNavigate } from "react-router-dom";
import "../styles/PaginaInicio.css"; // Ruta correcta a los estilos
import logo from "../assets/Logo G.png"; // Asegúrate de que la imagen está en esta ruta

const PaginaInicio = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/ventas");
  };

  return (
    <div className="container">
      {/* Sección izquierda con el logo */}
      <div className="left">
        <img src={logo} alt="Logo" className="logo-inicio" />
      </div>

      {/* Sección derecha con el formulario */}
      <div className="right">
        {/* Título en dos líneas con animación */}
        <div className="title-container">
          <span>Login to your</span>
          <span>Account</span>
        </div>

        {/* Inputs de usuario y contraseña */}
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />

        {/* Botón de login */}
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default PaginaInicio;
