import { createContext, useContext, useState } from 'react';

const LikesContext = createContext();

export const LikesProvider = ({ children }) => {
  const [likedItems, setLikedItems] = useState([]);

  const toggleLike = (item) => {
    setLikedItems(prev => {
      const existingIndex = prev.findIndex(li => li.id === item.id);
      if (existingIndex > -1) {
        return prev.filter((_, index) => index !== existingIndex);
      }
      return [...prev, item];
    });
  };

  return (
    <LikesContext.Provider value={{ likedItems, toggleLike }}>
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = () => {
  const context = useContext(LikesContext);
  if (!context) throw new Error('useLikes must be used within a LikesProvider');
  return context;
};