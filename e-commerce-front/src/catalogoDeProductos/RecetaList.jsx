import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const homeCategories = [
  { title: "Saludables & Frescos", eyebrow: "Favoritos", className: "feature-large" },
  { title: "Pizzas", className: "feature-small" },
  { title: "Carnes", className: "feature-small" },
  { title: "Dulces", className: "feature-tall" },
];

const RecetaList = ({ variant = "catalog" }) => {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/recetas");
        if (!response.ok) {
          throw new Error("Error al cargar las recetas");
        }
        const data = await response.json();
        setRecetas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecetas();
  }, []);

  if (variant === "home") {
    return (
      <section className="home-inspiration">
        <div className="home-inspiration-heading">
          <div>
            <h1>Inspiración para hoy</h1>
            <p>Descubrí las categorías más buscadas por nuestra comunidad.</p>
          </div>
          <Link to="/catalogo">Ver todo el catálogo →</Link>
        </div>

        <div className="inspiration-grid">
          {homeCategories.map((category) => (
            <article className={`inspiration-card ${category.className}`} key={category.title}>
              <span className="inspiration-icon" aria-hidden="true"></span>
              <div>
                {category.eyebrow && <small>{category.eyebrow}</small>}
                <h2>{category.title}</h2>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (loading) {
    return <div className="catalog-state">Cargando el catálogo de recetas...</div>;
  }

  if (error) {
    return <div className="catalog-state catalog-state-error">Error: {error}</div>;
  }

  const items = Array.isArray(recetas) ? recetas : [];

  return (
    <section className="catalog-section">
      <div className="catalog-heading">
        <div>
          <p className="section-kicker">Elegí tu próxima comida</p>
          <h1>Catálogo de recetas</h1>
        </div>
        <p>Explorá opciones caseras, simples y listas para sumar a tu mesa.</p>
      </div>

      {items.length === 0 ? (
        <div className="catalog-empty">
          No hay recetas disponibles en este momento.
        </div>
      ) : (
        <div className="receta-grid">
          {items.map((receta) => {
            const id = receta.id;
            const name = receta.nombre ?? "Sin nombre";
            const desc = receta.descripcion ?? "Sin descripción";
            const price = receta.precio ?? 0;
            const categorias = receta.categorias ?? [];

            return (
              <Link to={`/recetas/${id}`} key={id || name} className="receta-link">
                <article className="receta-card">
                  <div className="receta-image" aria-hidden="true">
                    <span>{name.charAt(0).toUpperCase()}</span>
                  </div>

                  <div className="receta-card-body">
                    <h3>{name}</h3>

                    {categorias.length > 0 && (
                      <div className="receta-tags">
                        {categorias.map((cat) => (
                          <span key={cat.idCategoria}>{cat.nombre}</span>
                        ))}
                      </div>
                    )}

                    <p className="receta-precio">
                      ${Number(price).toLocaleString("es-AR")}
                    </p>

                    <p className="receta-desc">
                      {desc.length > 92 ? `${desc.substring(0, 92)}...` : desc}
                    </p>

                    <span className="receta-detail">Ver detalle</span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RecetaList;
