import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface CartItem {
  id: number;
  productId: number;
  name: string;
  supplierName: string;
  supplierId: number;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  minOrder: number;
  deliveryTime: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  loading: boolean;
  error: string;
  loadCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cartCount = cartItems.length;

  const loadCart = async () => {
    if (!user) {
      setError('User not logged in');
      setCartItems([]);
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const items = await cartAPI.getItems();
      setCartItems(items);
    } catch (err) {
      setError('Failed to load cart items');
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    if (!user) {
      throw new Error('User not logged in');
    }
    try {
      await cartAPI.addItem(productId, quantity);
      await loadCart(); // Reload cart to get updated state
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (!user) {
      throw new Error('User not logged in');
    }
    try {
      await cartAPI.updateQuantity(itemId, quantity);
      await loadCart(); // Reload cart to get updated state
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: number) => {
    if (!user) {
      throw new Error('User not logged in');
    }
    try {
      await cartAPI.removeItem(itemId);
      await loadCart(); // Reload cart to get updated state
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!user) {
      throw new Error('User not logged in');
    }
    try {
      await cartAPI.clearCart();
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  // Load cart when user changes
  useEffect(() => {
    loadCart();
  }, [user]);

  const value = {
    cartItems,
    cartCount,
    loading,
    error,
    loadCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
