import React from "react";
import "../styles/styleButtonBack.css";

const ButtonBack = ({ fnGoBack, label }) => {
  return (
  
      <button onClick={fnGoBack} className="btnBack">Back 
      </button>
 
  );
};

export default ButtonBack;