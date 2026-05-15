import React, { useEffect, useState } from 'react';
import CrearReceta from './CrearReceta';

const AdminRecetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Control del popup
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    fetchRecetas();
  }, []);

  const fetchRecetas = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/recetas');

      if (!response.ok) {
        throw new Error('Error al cargar recetas');
      }

      const data = await response.json();
      setRecetas(data);

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta receta?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/recetas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar la receta');
      }

      setRecetas(recetas.filter(r => r.id !== id));

      alert('Receta eliminada con éxito');

    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Cargando panel...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>

      <h1>Gestión de Recetas</h1>

      <button
        onClick={() => setMostrarFormulario(true)}
        style={{
          marginBottom: '1rem',
          padding: '10px 16px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        + Nueva Receta
      </button>

      {/* MODAL */}
      {mostrarFormulario && (
        <div
          onClick={() => setMostrarFormulario(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999
          }}
        >
          {/* Evita que se cierre al hacer click dentro */}
          <div onClick={(e) => e.stopPropagation()}>
            <CrearReceta
              onRecetaCreada={() => {
                fetchRecetas();
                setMostrarFormulario(false);
              }}
              onCancelar={() => setMostrarFormulario(false)}
            />
          </div>
        </div>
      )}

      {/* TABLA */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '1rem'
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: '#f8f9fa',
              borderBottom: '2px solid #dee2e6'
            }}
          >
            <th style={{ padding: '1rem', textAlign: 'left' }}>
              Nombre
            </th>

            <th style={{ padding: '1rem', textAlign: 'left' }}>
              Precio
            </th>

            <th style={{ padding: '1rem', textAlign: 'center' }}>
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {recetas.length === 0 ? (
            <tr>
              <td
                colSpan="3"
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  color: '#6c757d'
                }}
              >
                No hay recetas registradas.
              </td>
            </tr>
          ) : (
            recetas.map((receta) => (
              <tr
                key={receta.id}
                style={{
                  borderBottom: '1px solid #dee2e6'
                }}
              >
                <td style={{ padding: '1rem' }}>
                  {receta.nombre}
                </td>

                <td style={{ padding: '1rem' }}>
                  ${receta.precio}
                </td>

                <td
                  style={{
                    padding: '1rem',
                    textAlign: 'center'
                  }}
                >
                  <button
                    style={{
                      marginRight: '0.5rem',
                      color: '#007bff',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(receta.id)}
                    style={{
                      color: '#dc3545',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
};

export default AdminRecetas;