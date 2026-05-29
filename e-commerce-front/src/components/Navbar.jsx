import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { esAdmin } from "../utils/auth";
import "../styles/Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logueado = !!localStorage.getItem("token");

  const isActive = (path) => location.pathname === path;
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    closeMenu();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          RecetaMarket
        </Link>

        <button
          className="hamburger"
          type="button"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={menuOpen ? "nav-menu nav-open" : "nav-menu"}>
          <li>
            <Link
              to="/"
              className={isActive("/") ? "nav-link active" : "nav-link"}
              onClick={closeMenu}
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/catalogo"
              className={isActive("/catalogo") ? "nav-link active" : "nav-link"}
              onClick={closeMenu}
            >
              Catálogo
            </Link>
          </li>

          {!logueado && (
            <>
              <li>
                <Link
                  to="/login"
                  className={isActive("/login") ? "nav-link active" : "nav-link"}
                  onClick={closeMenu}
                >
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className={isActive("/register") ? "nav-link active" : "nav-link"}
                  onClick={closeMenu}
                >
                  Registrarse
                </Link>
              </li>
            </>
          )}

          {logueado && (
            <>
              <li>
                <Link
                  to="/favoritos"
                  className={isActive("/favoritos") ? "nav-link active" : "nav-link"}
                  onClick={closeMenu}
                >
                  Favoritos
                </Link>
              </li>
              <li>
                <Link
                  to="/perfil"
                  className={isActive("/perfil") ? "nav-link active" : "nav-link"}
                  onClick={closeMenu}
                >
                  Mi perfil
                </Link>
              </li>

              {esAdmin() && (
                <li>
                  <Link
                    to="/admin"
                    className={isActive("/admin") ? "nav-link active" : "nav-link"}
                    onClick={closeMenu}
                  >
                    Admin
                  </Link>
                </li>
              )}

              <li>
                <button className="nav-link nav-logout" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
