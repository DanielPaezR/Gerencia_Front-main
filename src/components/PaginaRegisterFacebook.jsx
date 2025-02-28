import facebook from '../assets/Facebook.png';
import { useNavigate } from "react-router-dom";
import ButtonBack from '../components/ButtonBack';


function PaginaRegisterFacebook() {
    const navigate = useNavigate();
    const goBack = () => {
      navigate("/");
    };

    
  return (
    <div className="cardMarco">
        
        <div className="cardLogo">
            <img className="logo" src={facebook} alt="logo"/>
        </div>

        <ButtonBack fnGoToForgot={goBack} label="Back" />


    </div>
    
   
     
   )

 }
export default PaginaRegisterFacebook;