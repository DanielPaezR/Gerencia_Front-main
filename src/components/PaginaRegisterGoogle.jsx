import google from '../assets/Google.png';
import { useNavigate } from "react-router-dom";
import ButtonBack from '../components/ButtonBack';


function PaginaRegisterGoogle() {

    const navigate = useNavigate();
    const goBack = () => {
      navigate("/");
    };

    
  return (
    <div className="cardMarco">
        
        <div className="cardLogo">
            <img className="logo" src={google} alt="logo"/>
        </div>

        <ButtonBack fnGoToForgot={goBack} label="Back" />


    </div>
    
   
     
   )

 }
export default PaginaRegisterGoogle;