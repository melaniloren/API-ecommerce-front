import React, { useState } from 'react';

const UserLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                throw new Error('Credenciales inválidas o error en el servidor');
            }

            const data = await response.json();
            // Aquí guardarías el token JWT o la sesión (ej. localStorage.setItem('token', data.token))
            console.log('Login exitoso:', data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Iniciar Sesión</h2>
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</div>}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                    style={{ padding: '0.5rem' }}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    style={{ padding: '0.5rem' }}
                />
                <button type="submit" disabled={loading} style={{ padding: '0.75rem', backgroundColor: '#2D3277', color: 'white', border: 'none', borderRadius: '4px' }}>
                    {loading ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>
        </div>
    );
};

export default UserLogin;