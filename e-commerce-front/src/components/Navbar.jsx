import { Link, useLocation, useNavigate } from 'react-router-dom'
import { esAdmin } from '../utils/auth'
import '../styles/Navbar.css'

function Navbar() {
  const location = useLocation()
  const navigate  = useNavigate()
  const logueado  = !!localStorage.getItem('token')

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
    window.location.reload()
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-brand">
          🥘 RecetaMarket
        </Link>

        <ul className="nav-menu">
          <li>
            <Link to="/" className={isActive('/') ? 'nav-link active' : 'nav-link'}>
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/catalogo" className={isActive('/catalogo') ? 'nav-link active' : 'nav-link'}>
              Catálogo
            </Link>
          </li>

          {/* Solo si NO está logueado */}
          {!logueado && (
            <>
              <li>
                <Link to="/login" className={isActive('/login') ? 'nav-link active' : 'nav-link'}>
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link to="/register" className={isActive('/register') ? 'nav-link active' : 'nav-link'}>
                  Registrarse
                </Link>
              </li>
            </>
          )}

          {/* Solo si está logueado */}
          {logueado && (
            <>
              <li>
                <Link to="/perfil" className={isActive('/perfil') ? 'nav-link active' : 'nav-link'}>
                  Mi Perfil
                </Link>
              </li>

              {/* Solo si es ADMIN */}
              {esAdmin() && (
                <li>
                  <Link to="/admin" className={isActive('/admin') ? 'nav-link active' : 'nav-link'}>
                    Admin
                  </Link>
                </li>
              )}

              <li>
                <button className="nav-link nav-logout" onClick={handleLogout}>
                  🚪 Cerrar Sesión
                </button>
              </li>
            </>
          )}
        </ul>

      </div>
    </nav>
  )
}

export default Navbar