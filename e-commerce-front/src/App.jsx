import { useState } from 'react';
import RecetaList from './catalogoDeProductos/RecetaList';
import UserLogin from './gestionDeUsuarios/UserLogin';
import UserRegister from './gestionDeUsuarios/UserRegister';
import UserProfile from './gestionDeUsuarios/UserProfile';
import AdminRecetas from './panelAdmin/AdminRecetas';
import { esAdmin } from './utils/auth';
import './App.css';

function App() {
  const [vistaActiva, setVistaActiva] = useState('catalogo');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [logueado, setLogueado] = useState(!!localStorage.getItem('token'));
  const [admin, setAdmin] = useState(esAdmin());

  const handleLoginExitoso = () => {
    setLogueado(true);
    setAdmin(esAdmin()); // Actualizamos el rol después del login
    setVistaActiva('catalogo');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLogueado(false);
    setAdmin(false);
    setVistaActiva('catalogo');
  };

  const navegar = (vista) => {
    setVistaActiva(vista);
    setMenuAbierto(false);
  };

  const navItems = [
    { id: 'catalogo',  label: 'Catálogo',       visible: true },
    { id: 'login',     label: 'Iniciar Sesión',   visible: !logueado },
    { id: 'register',  label: 'Registrarse',       visible: !logueado },
    { id: 'perfil',    label: 'Mi Perfil',         visible: logueado },
    { id: 'admin',     label: 'Admin',             visible: logueado && admin }, // Solo ADMIN
  ].filter(item => item.visible);

  const renderVista = () => {
    switch (vistaActiva) {
      case 'catalogo':  return <RecetaList />;
      case 'login':     return <UserLogin onLoginExitoso={handleLoginExitoso} />;
      case 'register':  return <UserRegister />;
      case 'perfil':    return <UserProfile />;
      case 'admin':
        // Doble chequeo: si alguien navega directo a 'admin' sin ser admin, lo bloqueamos
        return admin
          ? <AdminRecetas />
          : <div style={{ padding: '2rem', color: 'red' }}>⛔ No tenés permiso para acceder a esta sección.</div>;
      default:          return <RecetaList />;
    }
  };

  return (
    <div className="app-wrapper">

      {/* ── NAVBAR ── */}
      <header className="navbar">
        <div className="navbar-brand" onClick={() => navegar('catalogo')}>
          <span className="brand-icon">🥘</span>
          <span className="brand-name">RecetaMarket</span>
        </div>

        <button
          className={`hamburger ${menuAbierto ? 'open' : ''}`}
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
        >
          <span /><span /><span />
        </button>

        <nav className={`nav-links ${menuAbierto ? 'nav-open' : ''}`}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-btn ${vistaActiva === item.id ? 'active' : ''}`}
              onClick={() => navegar(item.id)}
            >
              {item.label}
            </button>
          ))}
          {logueado && (
            <button className="nav-btn" onClick={handleLogout}>
              🚪 Cerrar Sesión
            </button>
          )}
        </nav>
      </header>

      {/* ── HERO (solo en catálogo) ── */}
      {vistaActiva === 'catalogo' && (
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Descubrí recetas únicas</h1>
            <p className="hero-sub">Las mejores recetas artesanales, listas para cocinar en casa.</p>
            <button className="hero-cta" onClick={() => navegar('register')}>
              Comenzar ahora →
            </button>
          </div>
          <div className="hero-deco" aria-hidden="true">🫕</div>
        </section>
      )}

      {/* ── CONTENIDO PRINCIPAL ── */}
      <main className="main-content">
        {renderVista()}
      </main>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <p>© 2025 RecetaMarket · Hecho con ❤️ y mucho sabor</p>
      </footer>
    </div>
  );
}

export default App;
