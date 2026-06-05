import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriteItems: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const product = action.payload;
      const index = state.favoriteItems.findIndex((item) => item.id === product.id);

      if (index !== -1) {
        state.favoriteItems.splice(index, 1);
        return;
      }

      state.favoriteItems.push(product);
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export const selectFavoriteItems = (state) => state.favorites.favoriteItems;

export default favoritesSlice.reducer;