import { Navigate } from 'react-router-dom';
import { esAdmin }  from '../utils/auth';

function RutaProtegida({ children, soloAdmin = false }) {
  const token = localStorage.getItem('token');

  // Sin token: redirige al login
  if (!token) return <Navigate to="/login" replace />;

  // Requiere admin pero no lo es: muestra error
  if (soloAdmin && !esAdmin()) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        ⛔ No tenés permiso para acceder a esta sección.
      </div>
    );
  }

  return children;
}

export default RutaProtegida;