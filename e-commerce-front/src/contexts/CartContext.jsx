// Importamos las herramientas necesarias de React.
import { createContext, useContext, useState } from "react";

// --- 1. CREACIÓN DEL CONTEXTO ---
// Acá creamos el "canal" o "túnel" de datos que compartirá la información del carrito.
const CartContext = createContext();

// --- 2. CUSTOM HOOK (Hook Personalizado) para consumir el contexto ---
// Esto evita tener que importar useContext y CartContext en cada componente.
export function useCart() {
  const context = useContext(CartContext);
  // Validación: si alguien usa useCart() fuera del CartProvider, tiramos error.
  if (context === undefined) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
}

// --- 3. CREACIÓN DEL PROVEEDOR (PROVIDER) ---
// Componente que "provee" el estado y las funciones del carrito a todos los hijos.
export function CartProvider({ children }) {
  // cartItems: array de productos del carrito. Empieza vacío.
  const [cartItems, setCartItems] = useState([]);

  // Función para AGREGAR un producto al carrito.
  // Si ya existe, le suma 1 a la cantidad; si no, lo agrega con cantidad 1.
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const yaEsta = prevItems.find((item) => item.id === product.id);
      if (yaEsta) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, cantidad: 1 }];
    });
    console.log(`${product.nombre} agregado al carrito!`);
  };

  // Función para QUITAR un producto del carrito (lo saca por completo).
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // Función para VACIAR el carrito.
  const clearCart = () => {
    setCartItems([]);
  };

  // Objeto que exponemos al resto de la app.
  const value = { cartItems, addToCart, removeFromCart, clearCart };

  // El Provider renderiza el contexto y los hijos.
  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}
