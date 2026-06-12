import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "./favoritesSlice";
import cartReducer from "./cartSlice";
import pedidosReducer from "./pedidosSlice";

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    cart: cartReducer,
    pedidos: pedidosReducer,
  },
});
