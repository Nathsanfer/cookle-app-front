import React, { createContext, useState, useContext } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState({});
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  const toggleFavorite = (recipe) => {
    const recipeId = recipe.id;
    
    setFavorites(prev => {
      const newFavorites = { ...prev };
      
      if (newFavorites[recipeId]) {
        // Remove dos favoritos
        delete newFavorites[recipeId];
        setFavoriteRecipes(prevRecipes => 
          prevRecipes.filter(r => r.id !== recipeId)
        );
      } else {
        // Adiciona aos favoritos
        newFavorites[recipeId] = true;
        setFavoriteRecipes(prevRecipes => [...prevRecipes, recipe]);
      }
      
      return newFavorites;
    });
  };

  const isFavorite = (recipeId) => {
    return !!favorites[recipeId];
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      favoriteRecipes, 
      toggleFavorite, 
      isFavorite 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
}
