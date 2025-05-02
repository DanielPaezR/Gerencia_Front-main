import React, { useState } from 'react';
import axios from 'axios';

function ProductForm() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    startDate: '', // Inicio de venta
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,

    }));
  };

// este es un comentario de prueba para ver si se sube el archivo


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convertir startDate al formato ISO requerido por la API
    const productToSend = {
      ...product,
      startDate: new Date(product.startDate).toISOString(),
    };

    try {
      const response = await axios.post('https://tu-api.com/productos', productToSend);
      console.log('Producto creado:', response.data);
      alert('Producto creado exitosamente');
    } catch (error) {
      console.error('Error al crear el producto:', error);
      alert('Hubo un error al crear el producto');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nombre del producto:
        <input type="text" name="name" value={product.name} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Descripción:
        <textarea name="description" value={product.description} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Precio:
        <input type="number" name="price" value={product.price} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Inicio de venta:
        <input type="date" name="startDate" value={product.startDate} onChange={handleChange} required />
      </label>
      <br />
      <button type="submit">Crear producto</button>
    </form>
  );
}

export default ProductForm;
