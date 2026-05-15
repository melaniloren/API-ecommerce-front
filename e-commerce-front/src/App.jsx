import { useState } from 'react';
import RecetaList from './catalogoDeProductos/RecetaList';
import UserLogin from './gestionDeUsuarios/UserLogin';
import UserRegister from './gestionDeUsuarios/UserRegister';
import UserProfile from './gestionDeUsuarios/UserProfile';
import AdminRecetas from './panelAdmin/AdminRecetas';
import './App.css';

function App() {
  // Vista activa: 'catalogo' | 'login' | 'register' | 'perfil' | 'admin'
  const [vistaActiva, setVistaActiva] = useState('catalogo');
  const [menuAbierto, setMenuAbierto] = useState(false);

  const navItems = [
    { id: 'catalogo', label: 'Catálogo' },
    { id: 'login',    label: 'Iniciar Sesión' },
    { id: 'register', label: 'Registrarse' },
    { id: 'perfil',   label: 'Mi Perfil' },
    { id: 'admin',    label: 'Admin' },
  ];

  const navegar = (vista) => {
    setVistaActiva(vista);
    setMenuAbierto(false);
  };

  const renderVista = () => {
    switch (vistaActiva) {
      case 'catalogo':  return <RecetaList />;
      case 'login':     return <UserLogin />;
      case 'register':  return <UserRegister />;
      case 'perfil':    return <UserProfile />;
      case 'admin':     return <AdminRecetas />;
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

        {/* Hamburguesa mobile */}
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
