import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function RecetaDetalle() {
  const { id } = useParams();          // extrae el :id de la URL /recetas/5
  const navigate = useNavigate();
  const [receta,  setReceta]  = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/recetas/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Receta no encontrada');
        return res.json();
      })
      .then(data => setReceta(data))
      .catch(err => setError(err.message))
      .finally(() => setCargando(false));
  }, [id]);  // se vuelve a ejecutar si cambia el id en la URL

  if (cargando) return <p>Cargando receta...</p>;
  if (error)    return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="receta-detalle">
      <button onClick={() => navigate(-1)}>← Volver</button>
      <h1>{receta.nombre}</h1>
      <p><strong>Precio:</strong> ${receta.precio}</p>
      <p><strong>Descripción:</strong> {receta.descripcion}</p>
    </div>
  );
}

export default RecetaDetalle;