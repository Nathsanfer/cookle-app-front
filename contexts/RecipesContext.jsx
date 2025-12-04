import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage wrapper: usa AsyncStorage quando disponível (React Native),
// e faz fallback para localStorage no ambiente web.
const storage = {
  async getItem(key) {
    try {
      if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
        return await AsyncStorage.getItem(key);
      }
    } catch (e) {
      console.warn('AsyncStorage.getItem falhou, tentando localStorage', e);
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      return Promise.resolve(window.localStorage.getItem(key));
    }
    return Promise.resolve(null);
  },
  async setItem(key, value) {
    try {
      if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
        return await AsyncStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('AsyncStorage.setItem falhou, tentando localStorage', e);
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(key, value);
        return Promise.resolve();
      } catch (e) {
        console.warn('localStorage.setItem falhou', e);
      }
    }
    return Promise.resolve();
  }
};

const RecipesContext = createContext();

const STORAGE_KEY = '@cookle_created_recipes';
const API_BASE = 'http://localhost:5000';

export function RecipesProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar receitas criadas do AsyncStorage ao iniciar
  useEffect(() => {
    loadCreatedRecipes();
  }, []);

  const loadCreatedRecipes = async () => {
    try {
      console.log('RecipesContext: loadCreatedRecipes - reading storage key', STORAGE_KEY);
      const stored = await storage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCreatedRecipes(parsed);
      }
    } catch (error) {
      console.error('Erro ao carregar receitas salvas:', error);
    }
  };

  const loadApiRecipes = async () => {
    try {
      const response = await fetch(`${API_BASE}/recipes`);
      if (!response.ok) {
        throw new Error('Erro ao buscar receitas da API');
      }
      const data = await response.json();
      const recipeArray = Array.isArray(data) ? data : (data.recipes || data.data || []);
      setRecipes(recipeArray);
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
    }
  };

  // Combinar receitas criadas + API
  const getAllRecipes = () => {
    return [...createdRecipes, ...recipes];
  };

  const addRecipe = async (recipeData) => {
    try {
      // Gerar ID único
      const newRecipe = {
        id: Date.now().toString(),
        ...recipeData,
        isCreated: true, // Flag para identificar receitas criadas localmente
        createdAt: new Date().toISOString(),
      };

      // Adicionar localmente
      const updated = [newRecipe, ...createdRecipes];
      setCreatedRecipes(updated);

      console.log('RecipesContext: addRecipe - persisting', { newRecipe });
      // Persistir no storage (AsyncStorage ou localStorage no web)
      await storage.setItem(STORAGE_KEY, JSON.stringify(updated));

      console.log('RecipesContext: addRecipe - persisted successfully');

      return newRecipe;
    } catch (error) {
      console.error('Erro ao adicionar receita:', error);
      throw error;
    }
  };

  const deleteRecipe = async (recipeId) => {
    try {
      console.log('RecipesContext: deleteRecipe - deleting', recipeId);
      const updated = createdRecipes.filter(r => r.id !== recipeId);
      setCreatedRecipes(updated);
      await storage.setItem(STORAGE_KEY, JSON.stringify(updated));
      console.log('RecipesContext: deleteRecipe - deleted and persisted', recipeId);
    } catch (error) {
      console.error('Erro ao deletar receita:', error);
      throw error;
    }
  };

  const updateRecipe = async (recipeId, updates) => {
    try {
      console.log('RecipesContext: updateRecipe - updating', { recipeId, updates });
      const updated = createdRecipes.map(r => 
        r.id === recipeId ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
      );
      setCreatedRecipes(updated);
      await storage.setItem(STORAGE_KEY, JSON.stringify(updated));
      console.log('RecipesContext: updateRecipe - updated and persisted', recipeId);
    } catch (error) {
      console.error('Erro ao atualizar receita:', error);
      throw error;
    }
  };

  const getRecipeById = (id) => {
    // Buscar em receitas criadas primeiro
    const created = createdRecipes.find(r => r.id === id);
    if (created) return created;

    // Depois em receitas da API
    return recipes.find(r => r.id === id);
  };

  return (
    <RecipesContext.Provider
      value={{
        recipes,
        createdRecipes,
        loading,
        getAllRecipes,
        addRecipe,
        deleteRecipe,
        updateRecipe,
        getRecipeById,
        loadApiRecipes,
        loadCreatedRecipes,
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error('useRecipes deve ser usado dentro de um RecipesProvider');
  }
  return context;
}
