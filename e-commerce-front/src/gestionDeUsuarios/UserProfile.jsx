import React, { useEffect, useState } from 'react';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Asumiendo que enviamos un token en los headers para identificar al usuario
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/api/usuarios/perfil', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al cargar el perfil del usuario');
                }

                const data = await response.json();
                setProfile(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div>Cargando perfil...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!profile) return <div>No se encontró la información del perfil.</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h1>Mi Perfil</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p><strong>Nombre:</strong> {profile.nombre}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Rol:</strong> {profile.rol}</p>
            </div>

            <hr style={{ margin: '2rem 0' }} />

            <h2>Mis Recetas Compradas</h2>
            {/* Aquí podrías mapear las recetas asociadas al usuario de manera similar a ProductList */}
            <p style={{ color: '#666' }}>Aún no has adquirido ninguna receta.</p>
        </div>
    );
};

export default UserProfile;