import "../styles/Hero.css";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Descubrí recetas únicas</h1>
        <p className="hero-sub">
          Las mejores recetas artesanales, listas para cocinar en casa.
        </p>
        <button className="hero-cta" onClick={() => navigate("/register")}>
          Comenzar ahora →
        </button>
      </div>
      <div className="hero-deco" aria-hidden="true">
        🫕
      </div>
    </section>
  );
}

export default Hero;
