
import { useNavigate } from "react-router-dom";
import "../styles/AñadirProducto.css"; // Ruta correcta al CSS
import logo from "../assets/Logo G.png"; 
import searchIcon from "../assets/search.png"; // Ícono de búsqueda
import viewIcon from "../assets/visualizar.png"; // Ícono de vista
import editIcon from "../assets/editar.png"; // Ícono de editar
import deleteIcon from "../assets/eliminar.png"; // Ícono de eliminar

const DatosClientes = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/inicio");
  };

  const handleView = (id) => {
    console.log(`Ver cliente con ID: ${id}`);
    // Lógica para ver el cliente
  };

  const handleEdit = (id) => {
    console.log(`Editar cliente con ID: ${id}`);
    // Lógica para editar el cliente
  };

  const handleDelete = (id) => {
    console.log(`Eliminar cliente con ID: ${id}`);
    // Lógica para eliminar el cliente
  };

  return (
    <div className="container">
      <div className="left">
        <img src={logo} alt="Logo" className="logo-inicio" />
      </div>
      <div className="right">
        
        
        <div className="input-container">
          <img src={searchIcon} alt="Search" className="input-icon" />
          <input type="text" placeholder="Buscar ID" />
        </div>

        

        <div className="pagination">
          <button>{"<"}</button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button key={page}>{page}</button>
          ))}
          <button>{">"}</button>
        </div>

        <button className="back-button" onClick={handleBack}>Volver</button>
      </div>
    </div>
  );
};

export default DatosClientes;