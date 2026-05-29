import { Navigate } from 'react-router-dom';
import { esAdmin } from '../utils/auth';
// import { useAuth } from '../features/auth/context/AuthContext';

const RutaProtegida = ({ children, soloAdmin = false }) => {
  //traigo del contexto (o información global) los datos del usuario, si está autenticado, sus datos,
  // const { isAuthenticated, loading } = useAuth();

  // if (loading) {
  //   return <div>Cargando...</div>;
  // }

  //hardcodeado provisoriamente con el token de localStorage, luego mediante jwt en java veremos si está logueado
  //para ver un ejemplo AuthContext,
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta requiere admin pero el usuario no lo es, mostramos un error
  if (soloAdmin && !esAdmin()) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        ⛔ No tenés permiso para acceder a esta sección.
      </div>
    );
  }

  return children;
};

export default RutaProtegida;