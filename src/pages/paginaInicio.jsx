import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/PaginaInicio.css"; // Ruta correcta al CSS
import logo from "../assets/Logo G.png";
import userIcon from "../assets/user.png";
import lockIcon from "../assets/password.png";

const PaginaInicio = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin123" && password === "12345") {
      Swal.fire({
        icon: "success",
        title: "Acceso concedido",
        text: "Bienvenido a la plataforma",
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        navigate("/ventas");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "Usuario o contraseña incorrectos",
      });
    }
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

        <form className= "form-login"  onSubmit={handleLogin}>
          <div className="input-container">
            <img src={userIcon} alt="User" className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <img src={lockIcon} alt="Lock" className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default PaginaInicio;
