import React, { useEffect, useState } from 'react';
 
const AdminRecetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  // useEffect para cargar la lista inicial de recetas
  useEffect(() => {
    fetchRecetas();
  }, []);
 
  const fetchRecetas = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/recetas');
      if (!response.ok) throw new Error('Error al cargar recetas');
      const data = await response.json();
      setRecetas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
 
  // Función para la BAJA (Delete)
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta receta?')) return;
 
    try {
      const response = await fetch(`http://localhost:8080/api/recetas/${id}`, {
        method: 'DELETE',
      });
 
      if (response.ok) {
        // Actualizamos el estado local para que desaparezca de la lista sin recargar
        setRecetas(recetas.filter(r => r.id !== id));
        alert('Receta eliminada con éxito');
      } else {
        throw new Error('No se pudo eliminar la receta');
      }
    } catch (err) {
      alert(err.message);
    }
  };
 
  if (loading) return <div>Cargando panel de control...</div>;
 
  return (
<div style={{ padding: '2rem' }}>
<h1>Gestión de Recetas (Admin)</h1>
<button style={{ marginBottom: '1rem', padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
        + Nueva Receta
</button>
 
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
<thead>
<tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
<th style={{ padding: '1rem', textAlign: 'left' }}>Nombre</th>
<th style={{ padding: '1rem', textAlign: 'left' }}>Precio</th>
<th style={{ padding: '1rem', textAlign: 'center' }}>Acciones</th>
</tr>
</thead>
<tbody>
          {recetas.map(receta => (
<tr key={receta.id} style={{ borderBottom: '1px solid #dee2e6' }}>
<td style={{ padding: '1rem' }}>{receta.nombre}</td>
<td style={{ padding: '1rem' }}>${receta.precio}</td>
<td style={{ padding: '1rem', textAlign: 'center' }}>
<button style={{ marginRight: '0.5rem', color: '#007bff' }}>Editar</button>
<button 
                  onClick={() => handleDelete(receta.id)} 
                  style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }}
>
                  Eliminar
</button>
</td>
</tr>
          ))}
</tbody>
</table>
</div>
  );
};
 
export default AdminRecetas;