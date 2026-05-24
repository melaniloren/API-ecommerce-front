import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const getInitial = (nombre = "") => nombre.trim().charAt(0).toUpperCase() || "R";

const getCategoryName = (categorias = []) =>
  categorias.length > 0 ? categorias[0].nombre : "Especial";

const getPreparationTime = (descripcion = "") => {
  if (descripcion.length > 60) return "35 min";
  if (descripcion.length > 30) return "25 min";
  return "18 min";
};

const getIntensityLabel = (precio = 0) => {
  if (precio >= 9000) return "Contundente";
  if (precio >= 7500) return "Equilibrada";
  return "Liviana";
};

function RecetaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receta, setReceta] = useState(null);
  const [relacionadas, setRelacionadas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceta = async () => {
      setCargando(true);
      setError(null);

      try {
        const [detalleResponse, recetasResponse] = await Promise.all([
          fetch(`http://localhost:8080/api/recetas/${id}`),
          fetch("http://localhost:8080/api/recetas"),
        ]);

        if (!detalleResponse.ok) {
          throw new Error("Receta no encontrada");
        }

        if (!recetasResponse.ok) {
          throw new Error("No se pudieron cargar recetas relacionadas");
        }

        const detalleData = await detalleResponse.json();
        const recetasData = await recetasResponse.json();

        const categoriaPrincipal = getCategoryName(detalleData.categorias ?? []);
        const sugeridas = (Array.isArray(recetasData) ? recetasData : [])
          .filter((item) => item.id !== detalleData.id)
          .sort((a, b) => {
            const aCategoria = getCategoryName(a.categorias ?? []);
            const bCategoria = getCategoryName(b.categorias ?? []);

            return Number(bCategoria === categoriaPrincipal) - Number(aCategoria === categoriaPrincipal);
          })
          .slice(0, 3);

        setReceta(detalleData);
        setRelacionadas(sugeridas);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchReceta();
  }, [id]);

  if (cargando) {
    return <div className="catalog-state">Cargando receta...</div>;
  }

  if (error || !receta) {
    return (
      <div className="catalog-state catalog-state-error">
        Error: {error ?? "No se encontró la receta."}
      </div>
    );
  }

  const nombre = receta.nombre ?? "Receta sin nombre";
  const descripcion = receta.descripcion ?? "Todavía no hay una descripción disponible.";
  const precio = Number(receta.precio ?? 0);
  const categorias = receta.categorias ?? [];
  const categoriaPrincipal = getCategoryName(categorias);
  const tiempo = getPreparationTime(descripcion);
  const intensidad = getIntensityLabel(precio);

  return (
    <section className="recipe-detail-page">
      <div className="recipe-detail-hero">
        <div className="recipe-detail-copy">
          <button className="recipe-back-button" onClick={() => navigate(-1)}>
            Volver
          </button>

          <p className="section-kicker">Detalle de receta</p>
          <div className="recipe-detail-tags">
            <span>{categoriaPrincipal}</span>
            <span>{tiempo}</span>
            <span>{intensidad}</span>
          </div>
          <h1>{nombre}</h1>
          <p className="recipe-detail-description">{descripcion}</p>

          <div className="recipe-detail-stats">
            <div>
              <strong>${precio.toLocaleString("es-AR")}</strong>
              <span>Precio final</span>
            </div>
            <div>
              <strong>{tiempo}</strong>
              <span>Preparación estimada</span>
            </div>
            <div>
              <strong>{categorias.length || 1}</strong>
              <span>Categoría destacada</span>
            </div>
          </div>
        </div>

        <div className="recipe-detail-visual" aria-hidden="true">
          <div className="recipe-detail-art">
            <div className="recipe-detail-art-letter">{getInitial(nombre)}</div>
          </div>
          <div className="recipe-detail-note">
            <strong>Una receta para repetir</strong>
            <span>Ideal para resolver una comida rica sin demasiadas vueltas.</span>
          </div>
        </div>
      </div>

      <div className="recipe-detail-grid">
        <div className="recipe-detail-main">
          <article className="recipe-detail-card">
            <p className="section-kicker">Sobre esta receta</p>
            <h2>Qué vas a encontrar</h2>
            <p>
              {nombre} combina una propuesta simple con una presentación clara para
              que puedas decidir rápido y sumar una opción rica a tu próxima comida.
            </p>

            <div className="recipe-detail-bullets">
              <div>
                <strong>Sabor protagonista</strong>
                <span>{categoriaPrincipal}</span>
              </div>
              <div>
                <strong>Perfil</strong>
                <span>{intensidad}</span>
              </div>
              <div>
                <strong>Momento ideal</strong>
                <span>Almuerzo o cena casera</span>
              </div>
            </div>
          </article>

          <article className="recipe-detail-card">
            <p className="section-kicker">Descripción completa</p>
            <h2>Una opción rica y fácil de elegir</h2>
            <p>{descripcion}</p>
            <p>
              El catálogo está pensado para que cada receta sea rápida de ubicar,
              con precio claro y una experiencia más prolija al momento de comparar.
            </p>
          </article>
        </div>

        <aside className="recipe-detail-sidebar">
          <article className="recipe-detail-card recipe-detail-summary">
            <p className="section-kicker">Resumen</p>
            <h2>Lista para tu próxima elección</h2>
            <div className="recipe-detail-price">${precio.toLocaleString("es-AR")}</div>
            <div className="recipe-detail-category-list">
              {categorias.map((cat) => (
                <span key={cat.idCategoria}>{cat.nombre}</span>
              ))}
              {categorias.length === 0 && <span>Especial del día</span>}
            </div>

            <div className="recipe-detail-checklist">
              <div>
                <strong>Ideal para</strong>
                <span>Resolver una comida casera sin perder tiempo.</span>
              </div>
              <div>
                <strong>Estilo</strong>
                <span>{intensidad} y fácil de elegir dentro del catálogo.</span>
              </div>
            </div>

            <Link to="/catalogo" className="recipe-detail-cta">
              Seguir explorando
            </Link>
          </article>
        </aside>
      </div>

      {relacionadas.length > 0 && (
        <section className="recipe-related-section">
          <div className="catalog-heading recipe-related-heading">
            <div>
              <p className="section-kicker">También te puede gustar</p>
              <h2>Más recetas para mirar</h2>
            </div>
            <p>Opciones cercanas en estilo y precio para seguir explorando.</p>
          </div>

          <div className="receta-grid">
            {relacionadas.map((item) => (
              <Link
                to={`/recetas/${item.id}`}
                key={item.id}
                className="receta-link"
              >
                <article className="receta-card">
                  <div className="receta-image" aria-hidden="true">
                    <span>{getInitial(item.nombre ?? "")}</span>
                  </div>
                  <div className="receta-card-body">
                    <h3>{item.nombre ?? "Receta"}</h3>
                    <div className="receta-tags">
                      <span>{getCategoryName(item.categorias ?? [])}</span>
                    </div>
                    <p className="receta-precio">
                      ${Number(item.precio ?? 0).toLocaleString("es-AR")}
                    </p>
                    <p className="receta-desc">
                      {(item.descripcion ?? "Sin descripción").length > 88
                        ? `${item.descripcion.substring(0, 88)}...`
                        : item.descripcion ?? "Sin descripción"}
                    </p>
                    <span className="receta-detail">Ver detalle</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}

export default RecetaDetalle;
