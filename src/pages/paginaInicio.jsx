import { useNavigate } from "react-router-dom";
import "../styles/PaginaInicio.css"; // Ahora la ruta apunta a la carpeta styles
import logo from "../assets/Logo G.png"; // Asegúrate de colocar la imagen en esta ruta

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
        <h2>Login to your Account</h2>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default PaginaInicio;
