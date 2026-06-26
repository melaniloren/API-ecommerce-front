// Importamos React y los hooks necesarios.
import { useEffect, useMemo, useState } from "react";
// Importamos componentes de routing.
import { Link, useNavigate } from "react-router-dom";
// useSelector para leer el estado de sesión desde Redux.
import { useSelector } from "react-redux";
// Importamos nuestros custom hooks para acceder al store de favoritos y al carrito.
import { useFavorite } from "../store/hooks/useFavorite";
import { useCart } from "../store/hooks/useCart";
import { loadCategories, loadRecetas } from "../utils/catalogStore";
import toast from "react-hot-toast"; // Para mostrar notificaciones al usuario

// Categorías hardcodeadas que se muestran solo en la vista "home".
const homeCategories = [
  { title: "Saludables & Frescos", eyebrow: "Favoritos", className: "feature-large", image: "/cat-saludables.webp" },
  { title: "Pizzas", className: "feature-small", image: "/cat-pizzas.webp" },
  { title: "Carnes", className: "feature-small", image: "/cat-carnes.webp" },
  { title: "Dulces", className: "feature-tall", image: "/cat-dulces.jpg" },
];

// Función auxiliar para obtener la categoría de la receta
const getRecipeCategory = (receta) => receta.categorias?.[0]?.nombre ?? "Especial";
const getRecipeImage = (receta) =>
  receta.imagen ?? receta.foto ?? receta.imagenUrl ?? receta.imageUrl ?? receta.urlImagen ?? "";

// --- COMPONENTE CONSUMIDOR: LISTA DE RECETAS ---
// Este componente es responsable de mostrar el catálogo, filtrar por categorías
// y permitir agregar recetas a favoritos y al carrito.
function RecetaList({ variant = "catalog" }) {
  // Estado local para recetas, categorías y filtros
  const [recetas, setRecetas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usamos los custom hooks para obtener funciones de los contextos.
  const { addToFavorite, esFavorito } = useFavorite();
  const { addToCart } = useCart();

  // useNavigate para redirigir al login si el usuario no tiene sesión iniciada.
  const navigate = useNavigate();
  const logueado = useSelector((state) => state.auth.isAuthenticated);

  // useEffect para cargar las recetas y categorías desde la API de forma simultánea
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [recipesData, categoriesData] = await Promise.all([loadRecetas(), loadCategories()]);
        setRecetas(recipesData);
        setCategorias(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // useMemo para filtrar las recetas eficientemente según la categoría seleccionada
  const recipesToShow = useMemo(() => {
    if (categoriaActiva === "all") {
      return recetas;
    }

    return recetas.filter((receta) =>
      (receta.categorias ?? []).some(
        (categoria) => String(categoria.idCategoria) === String(categoriaActiva),
      ),
    );
  }, [categoriaActiva, recetas]);

  // Variante "home": muestra solo las categorías destacadas, no el catálogo entero.
  if (variant === "home") {
    return (
      <section className="home-inspiration">
        <div className="home-inspiration-heading">
          <div>
            <h1>Inspiracion para hoy</h1>
            <p>Descubrí las categorias mas buscadas por nuestra comunidad.</p>
          </div>
          <Link to="/catalogo">Ver todo el catalogo</Link>
        </div>

        <div className="inspiration-grid">
          {homeCategories.map((category) => (
            <article
              className={`inspiration-card ${category.className}`}
              key={category.title}
              style={category.image ? {
                backgroundImage: `url(${category.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              } : undefined}
            >
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
    return <div className="catalog-state">Cargando el catalogo de recetas...</div>;
  }
  if (error) {
    return <div className="catalog-state catalog-state-error">Error: {error}</div>;
  }

  // Handler del corazón de favoritos (frena la navegación del Link y redirige si no está logueado)
  const handleFavoriteClick = (event, receta) => {
    event.preventDefault();
    event.stopPropagation();

    if (!logueado) {
      navigate("/login");
      return;
    }

    addToFavorite(receta);

    // Verificamos si ya era favorito para saber qué mensaje mostrar
    const yaEsFavorito = esFavorito(receta.id);
    if (yaEsFavorito) {
      toast.error("Receta quitada de favoritos"); // Usa el estilo rojo
    } else {
      toast.success("¡Receta guardada en favoritos!"); // Usa el estilo verde
    }
  };

  // Handler del botón "Agregar al carrito"
  const handleCartClick = (event, receta) => {
    event.preventDefault();
    event.stopPropagation();

    if (!logueado) {
      navigate("/login");
      return;
    }

    addToCart(receta);
    toast.success("¡Agregado al carrito!"); // Notificación de éxito
  };

  // Renderizamos la lista de recetas con sus filtros.
  return (
    <section className="catalog-section">
      <div className="catalog-heading">
        <div>
          <p className="section-kicker">Elegi tu proxima comida</p>
          <h1>Catalogo de recetas</h1>
        </div>
        <p>Explorá opciones caseras, simples y listas para sumar a tu mesa.</p>
      </div>

      {/* Botones de Filtros */}
      <div className="catalog-filters">
        <button
          className={categoriaActiva === "all" ? "catalog-filter active" : "catalog-filter"}
          type="button"
          onClick={() => setCategoriaActiva("all")}
        >
          Todas
        </button>
        {categorias.map((categoria) => (
          <button
            className={String(categoriaActiva) === String(categoria.idCategoria) ? "catalog-filter active" : "catalog-filter"}
            key={categoria.idCategoria}
            type="button"
            onClick={() => setCategoriaActiva(categoria.idCategoria)}
          >
            {categoria.nombre}
          </button>
        ))}
      </div>

      {/* Grid de Recetas Filtradas */}
      {recipesToShow.length === 0 ? (
        <div className="catalog-empty">
          No hay recetas disponibles para la categoria seleccionada.
        </div>
      ) : (
        <div className="receta-grid">
          {recipesToShow.map((receta) => {
            const favorito = logueado ? esFavorito(receta.id) : false;
            const recipeImage = getRecipeImage(receta);

            return (
              <Link to={`/recetas/${receta.id}`} key={receta.id} className="receta-link">
                <article className="receta-card receta-card-actions" style={{ position: "relative" }}>
                  {/* Botón del corazón (favoritos) */}
                  <button
                    className={favorito ? "favorite-toggle active" : "favorite-toggle"}
                    type="button"
                    onClick={(event) => handleFavoriteClick(event, receta)}
                    aria-label={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
                  >
                    {favorito ? "♥" : "♡"}
                  </button>

                  <div className="receta-image">
                    {recipeImage ? (
                      <img src={recipeImage} alt={receta.nombre ?? "Receta"} />
                    ) : (
                      <span>{(receta.nombre ?? "R").charAt(0).toUpperCase()}</span>
                    )}
                  </div>

                  <div className="receta-card-body">
                    <h3>{receta.nombre ?? "Sin nombre"}</h3>

                    <div className="receta-tags">
                      <span>{getRecipeCategory(receta)}</span>
                    </div>

                    <p className="receta-precio">
                      ${Number(receta.precio ?? 0).toLocaleString("es-AR")}
                    </p>

                    <p className="receta-desc">
                      {(receta.descripcion ?? "Sin descripcion").length > 92
                        ? `${receta.descripcion.substring(0, 92)}...`
                        : receta.descripcion ?? "Sin descripcion"}
                    </p>

                    {/* Botón para agregar al carrito */}
                    <button
                      className="catalog-cart-button"
                      type="button"
                      onClick={(event) => handleCartClick(event, receta)}
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
}

// Exportamos el componente para usarlo en otras partes de la aplicación.
export default RecetaList;
