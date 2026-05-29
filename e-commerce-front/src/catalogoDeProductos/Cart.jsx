// Importamos componentes de routing.
import { Link, useNavigate } from "react-router-dom";
// Importamos nuestro custom hook para acceder al contexto del carrito.
import { useCart } from "../contexts/CartContext";

// --- COMPONENTE CONSUMIDOR: PÁGINA DEL CARRITO ---
// Este componente muestra los productos agregados al carrito, permite modificar
// cantidades, quitarlos, vaciarlo y "finalizar la compra".
function Cart() {
  // Usamos el hook `useCart` para obtener el estado y las funciones del carrito.
  const { cartItems, removeFromCart, clearCart, addToCart } = useCart();
  // useNavigate para redirigir al catálogo desde el botón.
  const navigate = useNavigate();

  // Calculamos el total recorriendo todos los items y sumando precio * cantidad.
  const total = cartItems.reduce(
    (acc, item) => acc + Number(item.precio ?? 0) * item.cantidad,
    0
  );

  // Renderizado condicional: si el carrito está vacío, mostramos un mensaje.
  if (cartItems.length === 0) {
    return (
      <section className="catalog-section">
        <div className="catalog-heading">
          <h1>🛒 Mi carrito</h1>
        </div>
        <div className="catalog-empty">
          Tu carrito está vacío.
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

  // Renderizamos la lista de productos del carrito.
  return (
    <section className="catalog-section">
      <div className="catalog-heading">
        <div>
          <p className="section-kicker">Tu compra</p>
          <h1>🛒 Mi carrito</h1>
        </div>
        <p>
          {cartItems.length}{" "}
          {cartItems.length === 1 ? "producto" : "productos"} en el carrito
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Recorremos los items del carrito con .map */}
        {cartItems.map((item) => (
          <article
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
              border: "1px solid #eee",
              borderRadius: "8px",
              background: "#fff",
            }}
          >
            <div>
              <h3 style={{ margin: 0 }}>{item.nombre ?? "Sin nombre"}</h3>
              <p style={{ margin: "4px 0", color: "#666" }}>
                Cantidad: {item.cantidad} | Precio unitario: $
                {Number(item.precio ?? 0).toLocaleString("es-AR")}
              </p>
              <p style={{ margin: 0, fontWeight: "bold" }}>
                Subtotal: $
                {(Number(item.precio ?? 0) * item.cantidad).toLocaleString("es-AR")}
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              {/* Botón para sumar 1 unidad (vuelve a llamar a addToCart) */}
              <button onClick={() => addToCart(item)}>+1</button>
              {/* Botón para quitar el producto del carrito */}
              <button
                onClick={() => removeFromCart(item.id)}
                style={{ color: "#e63946" }}
              >
                Quitar
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Sección de total y acciones finales */}
      <div
        style={{
          marginTop: "24px",
          padding: "16px",
          borderTop: "2px solid #333",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Total: ${total.toLocaleString("es-AR")}</h2>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={clearCart}>Vaciar carrito</button>
          <button
            onClick={() => alert("¡Compra realizada con éxito!")}
            style={{
              background: "#2a9d8f",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Finalizar compra
          </button>
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <Link to="/catalogo">← Seguir comprando</Link>
      </div>
    </section>
  );
}

// Exportamos el componente para usarlo en otras partes de la aplicación.
export default Cart;
