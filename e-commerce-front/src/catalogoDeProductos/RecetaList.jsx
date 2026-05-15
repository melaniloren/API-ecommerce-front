import React, { useEffect, useState } from 'react';
// import './ProductList.css'; // Acordate de cambiarle el nombre al archivo CSS si lo renombrás

const RecetaList = () => {
    const [recetas, setRecetas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecetas = async () => {
            try {
                // Apuntamos al endpoint exacto de tu controlador de recetas
                const response = await fetch('http://localhost:8080/api/recetas');
                if (!response.ok) {
                    throw new Error('Error al cargar las recetas');
                }
                const data = await response.json();
                setRecetas(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecetas();
    }, []);

    if (loading) return <div>Cargando el catálogo de recetas...</div>;
    if (error) return <div>Error: {error}</div>;

    // Nos aseguramos de que sea un array
    const items = Array.isArray(recetas) ? recetas : [];

    return (
        <div>
            <h1>Catálogo de Recetas</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', padding: '1rem' }}>
                {items.length === 0 && <div>No hay recetas disponibles en este momento.</div>}

                {items.map(receta => {
                    // Extraemos los datos basándonos exactamente en tu RecetaDTO.java
                    const id = receta.id;
                    const name = receta.nombre ?? 'Sin nombre';
                    const desc = receta.descripcion ?? 'Sin descripción';
                    const price = receta.precio ?? 0;
                    const categorias = receta.categorias ?? []; // Array de CategoriaDTO

                    return (
                        <a
                            href={`/recetas/${id}`}
                            key={id || Math.random()}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                backgroundColor: '#fff'
                            }}>

                                {/* Placeholder para la imagen (ya que RecetaDTO no tiene atributo imagen) */}
                                <div style={{
                                    width: '100%',
                                    height: '150px',
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#999',
                                    fontStyle: 'italic'
                                }}>
                                    Sin imagen
                                </div>

                                <h3 style={{ margin: '0.5rem 0' }}>{name}</h3>

                                {/* Mostramos las etiquetas de la categoría si las tiene, usando CategoriaDTO */}
                                {categorias.length > 0 && (
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {categorias.map(cat => (
                                            <span key={cat.idCategoria} style={{
                                                fontSize: '0.75rem',
                                                backgroundColor: '#e9ecef',
                                                color: '#495057',
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                {cat.nombre}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <p style={{ color: '#2D3277', fontSize: '1.25rem', fontWeight: 'bold', margin: '0' }}>
                                    ${Number(price).toLocaleString('es-AR')}
                                </p>

                                <p style={{ color: '#666', margin: '0', fontSize: '0.9rem' }}>
                                    {/* Si la descripción es muy larga, la cortamos para que las tarjetas queden parejas */}
                                    {desc.length > 80 ? desc.substring(0, 80) + '...' : desc}
                                </p>

                                <span style={{ marginTop: '0.5rem', color: '#0a58ca', fontWeight: '500' }}>Ver detalle de la receta →</span>
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default RecetaList;