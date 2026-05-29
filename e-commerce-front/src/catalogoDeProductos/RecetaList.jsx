// Importamos React y los hooks necesarios.
import { useEffect, useState } from "react";
// Importamos componentes de routing.
import { Link, useNavigate } from "react-router-dom";
// Importamos nuestros custom hooks para acceder al contexto de favoritos y al carrito.
import { useFavorite } from "../contexts/FavoriteContext";
import { useCart } from "../contexts/CartContext";

// Categorías hardcodeadas que se muestran solo en la vista "home".
const homeCategories = [
  { title: "Saludables & Frescos", eyebrow: "Favoritos", className: "feature-large" },
  { title: "Pizzas", className: "feature-small" },
  { title: "Carnes", className: "feature-small" },
  { title: "Dulces", className: "feature-tall" },
];

// --- COMPONENTE CONSUMIDOR: LISTA DE RECETAS ---
// Este componente es responsable de mostrar el catálogo y de permitir agregar
// recetas a favoritos y al carrito usando los contextos correspondientes.
const RecetaList = ({ variant = "catalog" }) => {
  // Estado local: lista de recetas que vienen de la API.
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usamos los custom hooks para obtener funciones de los contextos.
  // Ya no necesitamos useContext directamente, queda más limpio.
  const { addToFavorite, esFavorito } = useFavorite();
  const { addToCart } = useCart();

  // useNavigate para redirigir al login si el usuario no tiene sesión iniciada.
  const navigate = useNavigate();
  const logueado = !!localStorage.getItem("token");

  // useEffect para cargar las recetas desde la API una sola vez al montar el componente.
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
  }, []); // El array vacío asegura que se ejecute solo al montar.

  // Variante "home": muestra solo las categorías destacadas, no el catálogo entero.
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

  // Renderizado condicional: mientras se carga o si hubo error.
  if (loading) {
    return <div className="catalog-state">Cargando el catálogo de recetas...</div>;
  }
  if (error) {
    return <div className="catalog-state catalog-state-error">Error: {error}</div>;
  }

  const items = Array.isArray(recetas) ? recetas : [];

  // Handler del corazón de favoritos.
  // Frena la navegación del Link envolvente y, si no hay sesión, manda al login.
  const handleFavoriteClick = (e, receta) => {
    e.preventDefault();
    e.stopPropagation();
    if (!logueado) {
      navigate("/login");
      return;
    }
    addToFavorite(receta);
  };

  // Handler del botón "Agregar al carrito" (misma lógica que el corazón).
  const handleCartClick = (e, receta) => {
    e.preventDefault();
    e.stopPropagation();
    if (!logueado) {
      navigate("/login");
      return;
    }
    addToCart(receta);
  };

  // Renderizamos la lista de recetas.
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
        <div className="catalog-empty">No hay recetas disponibles en este momento.</div>
      ) : (
        <div className="receta-grid">
          {items.map((receta) => {
            const id = receta.id;
            const name = receta.nombre ?? "Sin nombre";
            const desc = receta.descripcion ?? "Sin descripción";
            const price = receta.precio ?? 0;
            const categorias = receta.categorias ?? [];
            // Operador ternario: si no hay sesión, el corazón siempre va vacío.
            const favorito = logueado ? esFavorito(id) : false;

            return (
              <Link to={`/recetas/${id}`} key={id || name} className="receta-link">
                <article className="receta-card" style={{ position: "relative" }}>
                  {/* Botón del corazón (favoritos) */}
                  <button
                    type="button"
                    onClick={(e) => handleFavoriteClick(e, receta)}
                    aria-label={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.6rem",
                      color: favorito ? "#e63946" : "#bbb",
                      zIndex: 2,
                    }}
                  >
                    {favorito ? "♥" : "♡"}
                  </button>

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

                    {/* Botón para agregar al carrito */}
                    <button
                      type="button"
                      onClick={(e) => handleCartClick(e, receta)}
                      style={{
                        marginTop: "10px",
                        padding: "8px 12px",
                        background: "#2a9d8f",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      Agregar al carrito
                    </button>

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

// Exportamos el componente para usarlo en otras partes de la aplicación.
export default RecetaList;
