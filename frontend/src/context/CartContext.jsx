import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setCart(null);
      setCartCount(0);
      return;
    }
    try {
      setLoading(true);
      const data = await cartApi.getCart(user.id);
      setCart(data);
      const totalCount = (data.items || []).reduce((acc, item) => acc + (item.quantity || 0), 0);
      setCartCount(totalCount);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated || !user?.id) {
      throw new Error('Please log in to add items to your cart.');
    }
    const data = await cartApi.addToCart({
      userId: user.id,
      productId,
      quantity
    });
    setCart(data);
    const totalCount = (data.items || []).reduce((acc, item) => acc + (item.quantity || 0), 0);
    setCartCount(totalCount);
    return data;
  };

  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated || !user?.id) return;
    const data = await cartApi.updateQuantity(user.id, productId, quantity);
    setCart(data);
    const totalCount = (data.items || []).reduce((acc, item) => acc + (item.quantity || 0), 0);
    setCartCount(totalCount);
    return data;
  };

  const removeItem = async (productId) => {
    if (!isAuthenticated || !user?.id) return;
    const data = await cartApi.removeItem(user.id, productId);
    setCart(data);
    const totalCount = (data.items || []).reduce((acc, item) => acc + (item.quantity || 0), 0);
    setCartCount(totalCount);
    return data;
  };

  const clearCart = async () => {
    if (!isAuthenticated || !user?.id) return;
    await cartApi.clearCart(user.id);
    setCart({ items: [], totalAmount: 0, totalItems: 0 });
    setCartCount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        refreshCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
