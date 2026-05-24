import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const UserLogin = ({ onLoginExitoso }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
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
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas o error en el servidor");
      }

      const token = await response.text();
      localStorage.setItem("token", token);
      onLoginExitoso?.();
      navigate("/perfil");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-shell">
        <aside className="auth-aside" aria-hidden="true">
          <p className="section-kicker">Volvé a tu cocina</p>
          <h2>Guardá favoritas, comprá más rápido y seguí tus recetas.</h2>
          <div className="auth-plate">
            <span>🥘</span>
          </div>
          <div className="auth-mini-card">
            <strong>Tip del día</strong>
            <span>Prepará tus ingredientes antes de empezar.</span>
          </div>
        </aside>

        <div className="auth-card">
          <div className="auth-header">
            <p className="section-kicker">Ingresar</p>
            <h1>Iniciar sesión</h1>
            <p>Accedé a tu cuenta para continuar con RecetaMarket.</p>
          </div>

          {error && <div className="auth-alert auth-alert-error">Error: {error}</div>}

          <form className="auth-form" onSubmit={handleLogin}>
            <label>
              Correo electrónico
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Contraseña
              <input
                type="password"
                name="password"
                placeholder="Ingresá tu contraseña"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </label>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="auth-switch">
            ¿Todavía no tenés cuenta? <Link to="/register">Registrate</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default UserLogin;
