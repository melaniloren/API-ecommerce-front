import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, fetchCurrentUser, selectAuth } from "../store/authSlice";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(selectAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      await dispatch(fetchCurrentUser()).unwrap();
      navigate("/catalogo");
    } catch (err) {
      // el error ya queda en Redux state
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "4rem auto", padding: "2rem",
                  border: "1px solid #ddd", borderRadius: "8px" }}>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "8px", marginTop: "4px",
                     border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "8px", marginTop: "4px",
                     border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        {error && (
          <p style={{ color: "#dc2626", margin: 0 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{ padding: "10px", background: "#2a9d8f", color: "white",
                   border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
        >
          {isLoading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        ¿No tenés cuenta? <Link to="/register">Registrate</Link>
      </p>
    </div>
  );
};

export default UserLogin;
