import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectFavoriteItems, toggleFavorite } from "../favoritesSlice";

export function useFavorite() {
  const dispatch = useDispatch();
  const favoriteItems = useSelector(selectFavoriteItems);

  const addToFavorite = useCallback(
    (product) => {
      dispatch(toggleFavorite(product));
    },
    [dispatch],
  );

  const esFavorito = useCallback(
    (id) => favoriteItems.some((item) => item.id === id),
    [favoriteItems],
  );

  return { favoriteItems, addToFavorite, esFavorito };
}