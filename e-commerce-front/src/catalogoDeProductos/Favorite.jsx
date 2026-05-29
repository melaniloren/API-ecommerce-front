import { Link, useNavigate, useParams } from "react-router-dom";
import { useFavorite } from "../contexts/FavoriteContext";

function Favorite() {
  // useContext (vía custom hook) para traer la lista y la función toggle
  const { favoriteItems, addToFavorite } = useFavorite();

  // useParams: si viene /favoritos/:id mostramos solo esa receta favorita
  const { id } = useParams();
  const navigate = useNavigate();

  // Operador ternario + filtro condicional según haya o no :id
  const items = id
    ? favoriteItems.filter((item) => String(item.id) === String(id))
    : favoriteItems;

  // Renderizado condicional: si no hay favoritos, mostramos estado vacío
  if (favoriteItems.length === 0) {
    return (
      <section className="catalog-section">
        <div className="catalog-heading">
          <h1>Mis favoritos</h1>
        </div>
        <div className="catalog-empty">
          Todavía no agregaste recetas a tus favoritos.
          <button
            onClick={() => navigate("/catalogo")}
            style={{ marginLeft: "12px" }}
          >
            Ver catálogo
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="catalog-section">
      <div className="catalog-heading">
        <div>
          <p className="section-kicker">Tu selección</p>
          <h1>Mis favoritos</h1>
        </div>
        <p>
          {items.length}{" "}
          {items.length === 1 ? "receta guardada" : "recetas guardadas"}
        </p>
      </div>

      {/* Renderizado condicional con ternario: si filtraron por :id y no hay match */}
      {items.length === 0 ? (
        <div className="catalog-empty">
          Esa receta ya no está en tus favoritos.{" "}
          <Link to="/favoritos">Ver todos</Link>
        </div>
      ) : (
        <div className="receta-grid">
          {items.map((receta) => {
            const name = receta.nombre ?? "Sin nombre";
            const desc = receta.descripcion ?? "Sin descripción";
            const price = receta.precio ?? 0;

            return (
              <article className="receta-card" key={receta.id}>
                <div className="receta-image" aria-hidden="true">
                  <span>{name.charAt(0).toUpperCase()}</span>
                </div>

                <div className="receta-card-body">
                  <h3>{name}</h3>
                  <p className="receta-precio">
                    ${Number(price).toLocaleString("es-AR")}
                  </p>
                  <p className="receta-desc">
                    {desc.length > 92 ? `${desc.substring(0, 92)}...` : desc}
                  </p>

                  <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                    <button onClick={() => navigate(`/recetas/${receta.id}`)}>
                      Ver detalle
                    </button>
                    <button
                      onClick={() => addToFavorite(receta)}
                      style={{ color: "#e63946" }}
                    >
                      ♥ Quitar
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: "24px" }}>
        <Link to="/catalogo">← Volver al catálogo</Link>
      </div>
    </section>
  );
}

export default Favorite;
