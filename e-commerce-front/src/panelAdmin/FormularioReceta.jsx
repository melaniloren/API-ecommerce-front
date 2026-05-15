import React, { useState, useEffect } from 'react';
 
const FormularioReceta = ({ recetaParaEditar }) => {
  const [formData, setFormData] = useState({
    nombre: recetaParaEditar?.nombre || '',
    descripcion: recetaParaEditar?.descripcion || '',
    precio: recetaParaEditar?.precio || '',
    idCategoria: '' // Para vincular con el backend
  });
  const [categorias, setCategorias] = useState([]);
 
  // Cargamos las categorías para el desplegable (Select)
  useEffect(() => {
    const fetchCategorias = async () => {
      const response = await fetch('http://localhost:8080/api/categorias');
      const data = await response.json();
      setCategorias(data);
    };
    fetchCategorias();
  }, []);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Determinamos si es Alta (POST) o Modificación (PUT)
    const url = recetaParaEditar 
      ? `http://localhost:8080/api/recetas/${recetaParaEditar.id}` 
      : 'http://localhost:8080/api/recetas';
    const method = recetaParaEditar ? 'PUT' : 'POST';
 
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
 
      if (response.ok) {
        alert(recetaParaEditar ? 'Receta actualizada' : 'Receta creada');
      }
    } catch (err) {
      console.error(err);
    }
  };
 
  return (
<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
<input 
        type="text" 
        placeholder="Nombre de la receta" 
        value={formData.nombre} 
        onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
      />
<textarea 
        placeholder="Descripción" 
        value={formData.descripcion} 
        onChange={(e) => setFormData({...formData, descripcion: e.target.value})} 
      />
<input 
        type="number" 
        placeholder="Precio" 
        value={formData.precio} 
        onChange={(e) => setFormData({...formData, precio: e.target.value})} 
      />
      {/* Selector dinámico de categorías basado en CategoriaDTO */}
<select onChange={(e) => setFormData({...formData, idCategoria: e.target.value})}>
<option value="">Seleccionar Categoría</option>
        {categorias.map(cat => (
<option key={cat.idCategoria} value={cat.idCategoria}>
            {cat.nombre}
</option>
        ))}
</select>
 
      <button type="submit">Guardar Receta</button>
</form>
  );
};