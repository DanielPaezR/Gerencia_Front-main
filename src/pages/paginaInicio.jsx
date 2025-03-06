import { useNavigate } from "react-router-dom";
import "../styles/PaginaInicio.css"; // Ruta correcta al CSS
import logo from "../assets/Logo G.png"; 
import userIcon from "../assets/user.png"; // Ícono de usuario
import lockIcon from "../assets/password.png"; // Ícono de contraseña

const PaginaInicio = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/ventas");
  };

  return (
    <div className="container">
      <div className="left">
        <img src={logo} alt="Logo" className="logo-inicio" />
      </div>
      <div className="right">
        <h2>
          Login to your <br /> Account
        </h2>
        
        <div className="input-container">
          <img src={userIcon} alt="User" className="input-icon" />
          <input type="text" placeholder="Username" />
        </div>

        <div className="input-container">
          <img src={lockIcon} alt="Lock" className="input-icon" />
          <input type="password" placeholder="Password" />
        </div>

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default PaginaInicio;
