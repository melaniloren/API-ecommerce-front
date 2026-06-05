import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, clearCart, removeFromCart, selectCartItems } from "../cartSlice";

export function useCart() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const handleAddToCart = useCallback(
    (product) => {
      dispatch(addToCart(product));
    },
    [dispatch],
  );

  const handleRemoveFromCart = useCallback(
    (productId) => {
      dispatch(removeFromCart(productId));
    },
    [dispatch],
  );

  const handleClearCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return {
    cartItems,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    clearCart: handleClearCart,
  };
}