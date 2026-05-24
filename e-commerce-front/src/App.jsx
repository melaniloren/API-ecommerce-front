import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import RutaProtegida from "./routes/RutaProtegida";
import RecetaList from "./catalogoDeProductos/RecetaList";
import RecetaDetalle from "./catalogoDeProductos/RecetaDetalle";
import UserLogin from "./gestionDeUsuarios/UserLogin";
import UserRegister from "./gestionDeUsuarios/UserRegister";
import UserProfile from "./gestionDeUsuarios/UserProfile";
import AdminRecetas from "./panelAdmin/AdminRecetas";
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
          <Route path="/" element={<RecetaList />} />
          <Route path="/catalogo" element={<RecetaList />} />
          <Route path="/recetas/:id" element={<RecetaDetalle />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
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
        <p>© 2025 RecetaMarket · Hecho con amor y mucho sabor</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
