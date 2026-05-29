import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import RutaProtegida from "./routes/RutaProtegida";
import RecetaList from "./catalogoDeProductos/RecetaList";
import RecetaDetalle from "./catalogoDeProductos/RecetaDetalle";
import Favorite from "./catalogoDeProductos/Favorite";
import UserLogin from "./gestionDeUsuarios/UserLogin";
import UserRegister from "./gestionDeUsuarios/UserRegister";
import UserProfile from "./gestionDeUsuarios/UserProfile";
import AdminRecetas from "./panelAdmin/AdminRecetas";
import { FavoriteProvider } from "./contexts/FavoriteContext";
import "./styles/App.css";

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="app-wrapper">
      <Navbar />
      {isHome && <Hero />}

      <main className={isHome ? "main-content home-content" : "main-content"}>
        <Routes>
          <Route path="/" element={<RecetaList variant="home" />} />
          <Route path="/catalogo" element={<RecetaList />} />
          <Route path="/recetas/:id" element={<RecetaDetalle />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />

          {/* RUTAS PROTEGIDAS para favoritos */}
          <Route
            path="/favoritos"
            element={
              <RutaProtegida>
                <Favorite />
              </RutaProtegida>
            }
          />
          <Route
            path="/favoritos/:id"
            element={
              <RutaProtegida>
                <Favorite />
              </RutaProtegida>
            }
          />

          <Route
            path="/perfil"
            element={
              <RutaProtegida>
                <UserProfile />
              </RutaProtegida>
            }
          />
          <Route
            path="/admin"
            element={
              <RutaProtegida soloAdmin>
                <AdminRecetas />
              </RutaProtegida>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="footer">
        <div>
          <strong>RecetaMarket</strong>
          <p>© 2024 RecetaMarket. Sabores artesanales en tu hogar.</p>
        </div>
        <nav aria-label="Enlaces secundarios">
          <a href="#">Privacidad</a>
          <a href="#">Términos</a>
          <a href="#">Contacto</a>
          <a href="#">Preguntas Frecuentes</a>
        </nav>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <FavoriteProvider>
        <AppContent />
      </FavoriteProvider>
    </BrowserRouter>
  );
}

export default App;
