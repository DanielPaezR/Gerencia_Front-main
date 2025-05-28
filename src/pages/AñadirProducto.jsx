import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AñadirProducto.css";
import logo from "../assets/Logo G.png";

// Constantes exportadas para testing
export const API_BASE_URL = "http://localhost:3000/api";

export const initialFormState = {
  Name: "",
  ProductNumber: "",
  Color: "",
  StandardCost: "0",
  ListPrice: "0",
  Size: "",
  Weight: "",
  ProductCategoryID: "",
  ProductModelID: "",
  SellStartDate: new Date().toISOString().split("T")[0],
};

export const validateFormData = (formData) => {
  if (!formData.Name.trim()) {
    return "⚠️ El nombre del producto es obligatorio";
  }

  if (!formData.ProductNumber.trim()) {
    return "⚠️ El número de producto es obligatorio";
  }

  if (!formData.ProductCategoryID) {
    return "⚠️ Debe seleccionar una categoría";
  }

  const numericFields = ["StandardCost", "ListPrice", "Weight"];
  for (const field of numericFields) {
    if (formData[field] && parseFloat(formData[field]) < 0) {
      return `⚠️ El valor de ${field} no puede ser negativo`;
    }
  }

  return null;
};

const AñadirProducto = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const response = await fetch(`${API_BASE_URL}/products/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al cargar categorías");
        }

        setCategories(data.result);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        setMessage(`❌ ${error.message}`);
      }
    };

    fetchCategories();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const cleanedValue = value.replace(/[^0-9.]/g, "");

    if (cleanedValue.startsWith(".")) return;
    if ((cleanedValue.match(/\./g) || []).length > 1) return;

    setFormData((prev) => ({
      ...prev,
      [name]: cleanedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const validationError = validateFormData(formData);
    if (validationError) {
      setMessage(validationError);
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token") || "";
      const productToSend = {
        Name: formData.Name.trim(),
        ProductNumber: formData.ProductNumber.trim(),
        Color: formData.Color.trim() || null,
        StandardCost: parseFloat(formData.StandardCost || 0),
        ListPrice: parseFloat(formData.ListPrice || 0),
        Size: formData.Size.trim() || null,
        Weight: formData.Weight ? parseFloat(formData.Weight) : null,
        ProductCategoryID: parseInt(formData.ProductCategoryID),
        ProductModelID: formData.ProductModelID.trim() || null,
        SellStartDate: formData.SellStartDate,
      };

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productToSend),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Error al crear producto");
      }

      setMessage("✅ Producto creado correctamente");

      // Reset form
      setFormData(initialFormState);
    } catch (error) {
      console.error("Error:", error);
      setMessage(`❌ ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <aside className="left-sidebar">
        <img src={logo} alt="Logo" className="logo" />
        <button className="back-button" onClick={handleBack}>
          Volver
        </button>
      </aside>

      <main className="form-box">
        <h2 className="form-title">Añadir Nuevo Producto</h2>

        {message && (
          <p className={`confirmation-message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-section">
            {/* Columna izquierda */}
            <div className="form-group">
              <label htmlFor="productName" className="form-label">Nombre del Producto*</label>
              <input
                id="productName"
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Ej: Bicicleta de montaña"
                maxLength="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="productNumber" className="form-label">Número de Producto*</label>
              <input
                id="productNumber"
                type="text"
                name="ProductNumber"
                value={formData.ProductNumber}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Ej: BK-M82S-42"
                maxLength="25"
              />
            </div>

            <div className="form-group">
              <label htmlFor="productColor" className="form-label">Color</label>
              <input
                id="productColor"
                type="text"
                name="Color"
                value={formData.Color}
                onChange={handleChange}
                className="form-input"
                placeholder="Ej: Rojo"
                maxLength="30"
              />
            </div>

            <div className="form-group">
              <label htmlFor="productCategory" className="form-label">Categoría*</label>
              <select
                id="productCategory"
                name="ProductCategoryID"
                value={formData.ProductCategoryID}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Seleccione una categoría</option>
                {categories.map((category) => (
                  <option key={category.ProductCategoryID} value={category.ProductCategoryID}>
                    {category.Name} (ID: {category.ProductCategoryID})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            {/* Columna derecha */}
            <div className="form-group">
              <label htmlFor="standardCost" className="form-label">Costo Estándar ($)</label>
              <input
                id="standardCost"
                type="text"
                name="StandardCost"
                value={formData.StandardCost}
                onChange={handleNumberChange}
                className="form-input"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="listPrice" className="form-label">Precio de Venta ($)</label>
              <input
                id="listPrice"
                type="text"
                name="ListPrice"
                value={formData.ListPrice}
                onChange={handleNumberChange}
                className="form-input"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="productSize" className="form-label">Tamaño</label>
              <input
                id="productSize"
                type="text"
                name="Size"
                value={formData.Size}
                onChange={handleChange}
                className="form-input"
                placeholder="Ej: 38"
                maxLength="10"
              />
            </div>

            <div className="form-group">
              <label htmlFor="productWeight" className="form-label">Peso (kg)</label>
              <input
                id="productWeight"
                type="text"
                name="Weight"
                value={formData.Weight}
                onChange={handleNumberChange}
                className="form-input"
                placeholder="Opcional (ej: 12.5)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="productModel" className="form-label">Modelo ID</label>
              <input
                id="productModel"
                type="text"
                name="ProductModelID"
                value={formData.ProductModelID}
                onChange={handleChange}
                className="form-input"
                placeholder="Opcional"
                maxLength="25"
              />
            </div>

            <div className="form-group">
              <label htmlFor="sellStartDate" className="form-label">Fecha de Inicio de Venta*</label>
              <input
                id="sellStartDate"
                type="date"
                name="SellStartDate"
                value={formData.SellStartDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="submit-button">
            <button type="submit" className="button" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Producto"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AñadirProducto;