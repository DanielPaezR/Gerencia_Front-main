import React from "react";
import "../styles/styleButtonLogin.css";

const ButtonLogin = ({fnInicioSesion, label}) => {
    return (  
        <button onClick={fnInicioSesion} className ="btnIniciar">Login</button>
    );
}
 
export default ButtonLogin;