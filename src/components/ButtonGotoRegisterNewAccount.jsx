import React from "react";
import "../styles/styleButtonNewAccount.css";

const ButtonGoToRegisterNewAccount = ({ fnGoToRegisterNewAccount, label }) => {
  return (
  
      <button onClick={fnGoToRegisterNewAccount} className="btnNewAccount">Register new account 
      </button>
 
  );
};

export default ButtonGoToRegisterNewAccount;