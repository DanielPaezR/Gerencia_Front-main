import logo from '../assets/logo.png';
import user from '../assets/user.png';
import password from '../assets/password.png';
import Google from '../assets/Google.png';
import facebook from '../assets/facebook.png';
import { useNavigate } from "react-router-dom";
import "../styles/PaginaIniciar.css";
import ButtonLogin from "../components/ButtonLogin";
import ButtonGoToRegisterNewAccount from './ButtonGotoRegisterNewAccount';
import ButtonForgot from './ButtonForgot.jsx';
import "../styles/styleButtonFacebook.css";
import "../styles/styleButtonGoogle.css";


function PaginaIniciar() {
    const navigate = useNavigate();

    const goToRegisterNewAccount = () => {
      navigate("/RegisterNewAccount");
    };

    const goToForgot = () => {
        navigate("/ForgotPassword");
    };

    const goToGoogle = () => {
        navigate("/paginaGoogle");
    };

    const goToFacebook = () => {
        navigate("/paginaFacebook");
    };
  
    
    const respuesta = () => {
      MySwal.fire({
       title: `Soporte se pondrá en contacto contigo`,
       showCancelButton: true,
       confirmButtonText: "OK",
     }).then((result) => {
         if (result.isConfirmed) {
           //Accion en caso de que elijan el SI 
              navigate("/Login");
         }
     });
  }
  
  

  return (
    <div className="cardMarco">
        
        <div className="cardLogo">
            <img className="logo" src={logo} alt="logo"/>
        </div>

        <div className="cardForm">
            <h2>Login to your<br/>Account</h2>

            <div className="input_user">
                <img className="user" src={user} alt="user"/>
                <input className="inputs" type="text" placeholder="Username"
                onChange={(e)=> {setUsuario (e.target.value)}}/>
            </div>


            <div className="input_pass">
                <img className="password" src={password} alt="password"/>
                <input className="inputs" type="password" placeholder="Password"
                onChange={(e)=> {setPassword (e.target.value)}}/>
                
                <ButtonForgot fnGoToForgot={goToForgot} label="I forgot my password" />
            </div>
            
            <ButtonLogin label="Ingresar" />

            
            <div className="cardCrear">
                <button onClick={goToGoogle} htmlFor="ButtonGoogle" className="btnGoogle">
                    <img src= {Google} className="buttonGoogle" />
                    Continue with Google
                </button>

                <button onClick={goToFacebook} htmlFor="ButtonFacebook" className="btnFacebook">
                    <img src= {facebook} className="buttonFacebook" />
                    Continue with Facebook
                </button>

                

                <ButtonGoToRegisterNewAccount fnGoToRegisterNewAccount={goToRegisterNewAccount} label="RegisterNewAccount" />
            </div>
        </div>
    </div>
    
   
     
   )

 }
export default PaginaIniciar;