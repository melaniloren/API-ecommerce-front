// Importamos las herramientas necesarias de React.
// 'createContext' para crear el contexto, 'useState' para el estado de favoritos,
// y 'useContext' para consumirlo desde otros componentes.
import React, { useState, useContext, createContext } from 'react';

// --- 1. CREACIÓN DEL CONTEXTO ---
// Acá creamos el "canal" o "túnel" de datos que compartirá la lista de favoritos.
const FavoriteContext = createContext();

// --- 2. CUSTOM HOOK (Hook Personalizado) para consumir el contexto ---
// Esta función es una abstracción para hacer más fácil y limpio el uso del contexto en otros componentes.
// En lugar de importar `useContext` y `FavoriteContext` en cada componente, solo importan `useFavorite`.
export function useFavorite() {
  // El hook `useContext` se suscribe al `FavoriteContext` y lee su valor actual.
  const context = useContext(FavoriteContext);
  // Validación de seguridad: si un componente intenta usar `useFavorite()` pero no está envuelto
  // por el `FavoriteProvider`, el context será `undefined` y avisamos con un error claro.
  if (context === undefined) {
    throw new Error('useFavorite debe ser usado dentro de un FavoriteProvider');
  }

  // Si todo está bien, devolvemos el valor del contexto.
  return context;
}

// --- 3. CREACIÓN DEL PROVEEDOR (PROVIDER) ---
// Este componente "provee" el estado y las funciones de favoritos a todos los hijos
// que estén envueltos por él.
export function FavoriteProvider({ children }) {
  // Usamos `useState` para crear y manejar el estado de favoritos.
  // `favoriteItems` contiene el array de recetas favoritas. Inicia vacío `[]`.
  // `setFavoriteItems` es la función que usamos para actualizar `favoriteItems`.
  const [favoriteItems, setFavoriteItems] = useState([]);

  // Función que los componentes usarán para agregar (o quitar) una receta de favoritos.
  // Funciona como toggle: si ya está, la saca; si no, la agrega.
  const addToFavorite = (product) => {
    setFavoriteItems(prevItems => {
      // Chequeamos si la receta ya está en favoritos.
      const yaEsta = prevItems.some(item => item.id === product.id);
      if (yaEsta) {
        // Si ya está, la sacamos del array (toggle).
        return prevItems.filter(item => item.id !== product.id);
      }
      // Si no estaba, devolvemos un NUEVO array con la receta agregada.
      // No mutamos el estado directamente (no usamos push) porque React detecta cambios
      // por referencia. Si mutáramos, no se re-renderizaría.
      return [...prevItems, product];
    });
    console.log(`${product.nombre} agregado/quitado de favoritos!`);
  };

  // Función auxiliar para saber si una receta es favorita (útil para pintar el corazón).
  const esFavorito = (id) => favoriteItems.some(item => item.id === id);

  // Objeto con todo lo que queremos exponer globalmente.
  const value = { favoriteItems, addToFavorite, esFavorito };

  // El `FavoriteProvider` renderiza el `Provider` del contexto.
  // La prop `value` pasa el objeto a todos los componentes hijos.
  // `{children}` renderiza cualquier componente anidado dentro de `<FavoriteProvider>`.
  return (
    <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>
  );
}
