import React from "react";
import "../styles/styleButtonForgot.css";

const ButtonForgot = ({ fnGoToForgot, label }) => {
  return (
  
      <button onClick={fnGoToForgot} className="btnForgot">I forgot my password 
      </button>
 
  );
};

export default ButtonForgot;