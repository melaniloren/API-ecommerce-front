<<<<<<< Updated upstream
// Importamos React y los hooks necesarios.
import { useEffect, useState } from "react";
// Importamos componentes de routing.
=======
import { useEffect, useMemo, useState } from "react";
>>>>>>> Stashed changes
import { Link, useNavigate } from "react-router-dom";
// Importamos nuestros custom hooks para acceder al contexto de favoritos y al carrito.
import { useFavorite } from "../contexts/FavoriteContext";
import { useCart } from "../contexts/CartContext";
import { loadCategories, loadRecetas } from "../utils/catalogStore";

// Categorías hardcodeadas que se muestran solo en la vista "home".
const homeCategories = [
  { title: "Saludables & Frescos", eyebrow: "Favoritos", className: "feature-large" },
  { title: "Pizzas", className: "feature-small" },
  { title: "Carnes", className: "feature-small" },
  { title: "Dulces", className: "feature-tall" },
];

<<<<<<< Updated upstream
// --- COMPONENTE CONSUMIDOR: LISTA DE RECETAS ---
// Este componente es responsable de mostrar el catálogo y de permitir agregar
// recetas a favoritos y al carrito usando los contextos correspondientes.
const RecetaList = ({ variant = "catalog" }) => {
  // Estado local: lista de recetas que vienen de la API.
=======
const getRecipeCategory = (receta) => receta.categorias?.[0]?.nombre ?? "Especial";

function RecetaList({ variant = "catalog" }) {
>>>>>>> Stashed changes
  const [recetas, setRecetas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
<<<<<<< Updated upstream

  // Usamos los custom hooks para obtener funciones de los contextos.
  // Ya no necesitamos useContext directamente, queda más limpio.
  const { addToFavorite, esFavorito } = useFavorite();
  const { addToCart } = useCart();

  // useNavigate para redirigir al login si el usuario no tiene sesión iniciada.
=======
  const { addToFavorite, esFavorito } = useFavorite();
  const { addToCart } = useCart();
>>>>>>> Stashed changes
  const navigate = useNavigate();
  const logueado = !!localStorage.getItem("token");

  // useEffect para cargar las recetas desde la API una sola vez al montar el componente.
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

<<<<<<< Updated upstream
    fetchRecetas();
  }, []); // El array vacío asegura que se ejecute solo al montar.

  // Variante "home": muestra solo las categorías destacadas, no el catálogo entero.
=======
    fetchData();
  }, []);

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

>>>>>>> Stashed changes
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
    return <div className="catalog-state">Cargando el catalogo de recetas...</div>;
  }
  if (error) {
    return <div className="catalog-state catalog-state-error">Error: {error}</div>;
  }

  const handleFavoriteClick = (event, receta) => {
    event.preventDefault();
    event.stopPropagation();

<<<<<<< Updated upstream
  // Handler del corazón de favoritos.
  // Frena la navegación del Link envolvente y, si no hay sesión, manda al login.
  const handleFavoriteClick = (e, receta) => {
    e.preventDefault();
    e.stopPropagation();
=======
>>>>>>> Stashed changes
    if (!logueado) {
      navigate("/login");
      return;
    }

    addToFavorite(receta);
  };

<<<<<<< Updated upstream
  // Handler del botón "Agregar al carrito" (misma lógica que el corazón).
  const handleCartClick = (e, receta) => {
    e.preventDefault();
    e.stopPropagation();
=======
  const handleCartClick = (event, receta) => {
    event.preventDefault();
    event.stopPropagation();

>>>>>>> Stashed changes
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
          <p className="section-kicker">Elegi tu proxima comida</p>
          <h1>Catalogo de recetas</h1>
        </div>
        <p>Explorá opciones caseras, simples y listas para sumar a tu mesa.</p>
      </div>

<<<<<<< Updated upstream
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
=======
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

      {recipesToShow.length === 0 ? (
        <div className="catalog-empty">
          No hay recetas disponibles para la categoria seleccionada.
        </div>
      ) : (
        <div className="receta-grid">
          {recipesToShow.map((receta) => {
            const favorito = logueado ? esFavorito(receta.id) : false;

            return (
              <Link to={`/recetas/${receta.id}`} key={receta.id} className="receta-link">
                <article className="receta-card receta-card-actions">
>>>>>>> Stashed changes
                  <button
                    className={favorito ? "favorite-toggle active" : "favorite-toggle"}
                    type="button"
                    onClick={(event) => handleFavoriteClick(event, receta)}
                    aria-label={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
                  >
                    {favorito ? "♥" : "♡"}
                  </button>

                  <div className="receta-image" aria-hidden="true">
                    <span>{(receta.nombre ?? "R").charAt(0).toUpperCase()}</span>
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
