import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  const addToCart = (item, restId) => {
    if (restaurantId && restaurantId !== restId) {
      if (!window.confirm('Adding from a different restaurant will clear your cart. Continue?')) return;
      setCart([]);
    }
    setRestaurantId(restId);
    setCart(prev => {
      const exists = prev.find(i => i.menu_item_id === item.id);
      if (exists) return prev.map(i => i.menu_item_id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { menu_item_id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const removeFromCart = (menuItemId) => {
    setCart(prev => {
      const updated = prev.map(i => i.menu_item_id === menuItemId ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
      if (!updated.length) setRestaurantId(null);
      return updated;
    });
  };

  const clearCart = () => { setCart([]); setRestaurantId(null); };

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, restaurantId, addToCart, removeFromCart, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
