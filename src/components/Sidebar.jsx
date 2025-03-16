import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Sidebar = ({ onFilter }) => {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");

  const handleFilter = () => {
    // Envía los filtros seleccionados al componente padre
    onFilter({ category, price, brand });
  };

  return (
    <div className="sidebar">
      <h3>Filtros de Búsqueda</h3>

      <div className="filter-group">
        <label>Categoría</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Todas</option>
          <option value="bicicletas">Bicicletas</option>
          <option value="accesorios">Accesorios</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Precio</label>
        <select value={price} onChange={(e) => setPrice(e.target.value)}>
          <option value="">Todos</option>
          <option value="0-500">$0 - $500</option>
          <option value="500-1000">$500 - $1000</option>
          <option value="1000+">Más de $1000</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Marca</label>
        <input
          type="text"
          placeholder="Ej: Montaña, Urbana"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
      </div>

      <button className="filter-button" onClick={handleFilter}>Aplicar Filtros</button>

      <button
        className="add-product-button"
        onClick={() => navigate("/añadir-producto")}
      >
        Añadir Producto
      </button>
      <button
        className="clients-button"
        onClick={() => navigate("/clientes")}
      >
        Clientes
      </button>
    </div>
  );
};

export default Sidebar;