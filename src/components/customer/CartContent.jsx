import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems(prev => {
      const sanitizedPrice = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^0-9.]/g, '')) 
        : item.price;
  
      const numericPriceItem = {
        ...item,
        price: sanitizedPrice
      };
      
      const existing = prev.find(i => 
        i.id === numericPriceItem.id && 
        i.category === numericPriceItem.category
      );
      
      if (existing) {
        return prev.map(i => 
          i.id === numericPriceItem.id && i.category === numericPriceItem.category ? 
          { ...i, quantity: i.quantity + 1 } : 
          i
        );
      }
      return [...prev, { ...numericPriceItem, quantity: 1,addedAt: new Date().toISOString() }];
    });
  };
  const removeItem = (id, category) => {
    setCartItems(prev => 
      prev.filter(item => !(item.id === id && item.category === category))
    );
  };
  
  const updateQuantity = (id, category, newQuantity) => {
    setCartItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id && item.category === category) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      return updated.filter(item => item.quantity > 0);
    });
  };
  const clearCart = () => {
    setCartItems([]);
  };
  
  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    }}>
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