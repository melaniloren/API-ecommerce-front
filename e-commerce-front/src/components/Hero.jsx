import "../styles/Hero.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-kicker">{t("hero.kicker")}</p>
        <h1 className="hero-title">
          {t("hero.title")}
        </h1>
        <p className="hero-sub">
          {t("hero.subtitle")}
        </p>

        <div className="hero-actions">
          <button className="hero-cta" onClick={() => navigate("/catalogo")}>
            {t("hero.ctaCatalog")}
          </button>
          <button
            className="hero-cta hero-cta-secondary"
            onClick={() => navigate("/register")}
          >
            {t("hero.ctaRegister")}
          </button>
        </div>

        <div className="hero-highlights" aria-label="Beneficios">
          <span>{t("hero.highlightVerified")}</span>
          <span>{t("hero.highlightSimple")}</span>
          <span>{t("hero.highlightFast")}</span>
        </div>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="hero-recipe-card">
          <div className="hero-card-header">
            <span>
              <span className="hero-card-dot"></span>
              {t("hero.featuredRecipe")}
            </span>
            <strong>{t("hero.recipesCount")}</strong>
          </div>
          <div className="hero-plate">
            <img
              src="/risotto.webp"
              alt={t("hero.featuredDishName")}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }}
            />
          </div>
          <h2>{t("hero.featuredDishName")}</h2>
          <p className="hero-meta">
            {t("hero.readyIn")}<span></span>{t("hero.easyLevel")}
          </p>
          <div className="hero-card-footer">
            <div className="hero-rating">☆ ☆ ☆ ☆ ☆</div>
            <button type="button" aria-label={t("hero.addRecipe")}>+</button>
          </div>
        </div>
        <div className="hero-floating-badge">
          <span>{t("hero.perPortion")}</span>
          {t("hero.fromPrice")}
        </div>
      </div>
    </section>
  );
}

export default Hero;
