// Importamos las herramientas necesarias de React.
// 'createContext' para crear el contexto, 'useState' para el estado del carrito,
// y 'useContext' para consumirlo desde otros componentes.
import React, { useState, useContext, createContext } from 'react';

// --- 1. CREACIÓN DEL CONTEXTO ---
// Acá creamos el "canal" o "túnel" de datos que compartirá la información del carrito.
const CartContext = createContext();

// --- 2. CUSTOM HOOK (Hook Personalizado) para consumir el contexto ---
// Esta función es una abstracción para hacer más fácil y limpio el uso del contexto en otros componentes.
// En lugar de importar `useContext` y `CartContext` en cada componente, solo importan `useCart`.
export function useCart() {
  // El hook `useContext` se suscribe al `CartContext` y lee su valor actual.
  const context = useContext(CartContext);
  // Validación de seguridad: si un componente intenta usar `useCart()` pero no está envuelto
  // por el `CartProvider`, el context será `undefined` y avisamos con un error claro.
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }

  // Si todo está bien, devolvemos el valor del contexto.
  return context;
}

// --- 3. CREACIÓN DEL PROVEEDOR (PROVIDER) ---
// Este componente "provee" el estado y las funciones del carrito a todos los hijos
// que estén envueltos por él.
export function CartProvider({ children }) {
  // Usamos `useState` para manejar el estado del carrito.
  // `cartItems` contiene el array de productos. Inicia vacío `[]`.
  // `setCartItems` es la función para actualizar `cartItems`.
  const [cartItems, setCartItems] = useState([]);

  // Función para agregar un producto al carrito.
  // Si el producto ya existe, le suma 1 a la cantidad; si no, lo agrega con cantidad 1.
  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Buscamos si el producto ya está en el carrito.
      const yaEsta = prevItems.find(item => item.id === product.id);
      if (yaEsta) {
        // Si ya está, devolvemos un NUEVO array con la cantidad incrementada.
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      // Si no estaba, lo agregamos al final con cantidad 1.
      // Usamos spread (`...prevItems`) para no mutar el estado original.
      return [...prevItems, { ...product, cantidad: 1 }];
    });
    console.log(`${product.nombre} agregado al carrito!`);
  };

  // Función para quitar un producto entero del carrito.
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Función para vaciar todo el carrito de una.
  const clearCart = () => {
    setCartItems([]);
  };

  // Objeto con todo lo que exponemos globalmente.
  const value = { cartItems, addToCart, removeFromCart, clearCart };

  // El `CartProvider` renderiza el `Provider` del contexto.
  // La prop `value` pasa el objeto a todos los componentes hijos.
  // `{children}` renderiza cualquier componente anidado dentro de `<CartProvider>`.
  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}
