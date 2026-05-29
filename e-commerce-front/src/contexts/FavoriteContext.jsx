import { createContext, useContext, useState } from "react";

// 1. Creamos el contexto (el "túnel" de datos)
const FavoriteContext = createContext();

// 2. Custom hook para consumir el contexto más cómodo desde cualquier componente
export function useFavorite() {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error("useFavorite debe ser usado dentro de un FavoriteProvider");
  }
  return context;
}

// 3. Provider: provee el estado y las funciones a todos los hijos
export function FavoriteProvider({ children }) {
  const [favoriteItems, setFavoriteItems] = useState([]);

  // Toggle: si ya está, lo saca; si no, lo agrega
  const addToFavorite = (product) => {
    setFavoriteItems((prev) => {
      const yaEsta = prev.some((item) => item.id === product.id);
      if (yaEsta) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const esFavorito = (id) => favoriteItems.some((item) => item.id === id);

  const value = { favoriteItems, addToFavorite, esFavorito };

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
}
