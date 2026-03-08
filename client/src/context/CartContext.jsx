import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, addToCart as apiAddToCart, removeFromCart as apiRemove, clearCart as apiClear, updateCartItem as apiUpdate } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) { setCartItems([]); return; }
    setCartLoading(true);
    try {
      const { data } = await getCart();
      setCartItems(data);
    } catch { setCartItems([]); }
    finally { setCartLoading(false); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (itemData) => {
    const { data } = await apiAddToCart(itemData);
    setCartItems(prev => [...prev, data]);
  };

  const removeFromCart = async (id) => {
    await apiRemove(id);
    setCartItems(prev => prev.filter(i => i._id !== id));
  };

  const updateQty = async (id, quantity) => {
    const { data } = await apiUpdate(id, { quantity: String(quantity) });
    setCartItems(prev => prev.map(i => i._id === id ? data : i));
  };

  const clearCart = async () => {
    await apiClear();
    setCartItems([]);
  };

  const cartCount   = cartItems.length;
  const cartSubtotal = cartItems.reduce((sum, item) => {
    const final = item.price - (item.price * (item.discount || 0)) / 100;
    return sum + final * Number(item.quantity || 1);
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartLoading, cartCount, cartSubtotal, addToCart, removeFromCart, updateQty, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
