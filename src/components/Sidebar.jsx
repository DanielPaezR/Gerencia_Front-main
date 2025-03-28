import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Sidebar = ({ onFilter }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: '', // Ahora acepta IDs numéricos directamente
    price: '',
    brand: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = () => {
    onFilter(filters);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      price: '',
      brand: ''
    });
    onFilter({});
  };

  return (
    <div className="sidebar">
      <h3>Filtros de Búsqueda</h3>

      {/* Filtro de categoría como input de texto para IDs numéricos */}
      <div className="filter-group">
        <label>ID de Categoría</label>
        <input
          type="text"
          name="category"
          placeholder="Ej: 23, 33, etc."
          value={filters.category}
          onChange={handleInputChange}
        />
      </div>

      {/* Filtro de precio (se mantiene igual) */}
      <div className="filter-group">
        <label>Precio</label>
        <select
          name="price"
          value={filters.price}
          onChange={handleInputChange}
        >
          <option value="">Todos</option>
          <option value="0-500">$0 - $500</option>
          <option value="500-1000">$500 - $1000</option>
          <option value="1000+">Más de $1000</option>
        </select>
      </div>

      {/* Filtro de marca (se mantiene igual) */}
      <div className="filter-group">
        <label>Marca</label>
        <input
          type="text"
          name="brand"
          placeholder="Ej: Specialized, Trek"
          value={filters.brand}
          onChange={handleInputChange}
        />
      </div>

      {/* Botones de filtros (con botón para limpiar) */}
      <div className="filter-buttons">
        <button className="filter-button" onClick={handleApplyFilters}>
          Aplicar Filtros
        </button>
        <button className="clear-button" onClick={clearFilters}>
          Limpiar Filtros
        </button>
      </div>

      {/* Botones de navegación (se mantienen igual) */}
      <div className="navigation-buttons">
        <button
          className="add-product-button"
          onClick={() => navigate("/AñadirProducto")}
        >
          Añadir Producto
        </button>
        <button
          className="clients-button"
          onClick={() => navigate("/DatosClientes")}
        >
          Datos clientes
        </button>
      </div>
    </div>
  );
};

export default Sidebar;