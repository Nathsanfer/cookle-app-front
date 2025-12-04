import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ========== STORAGE WRAPPER ==========
// Abstração de armazenamento: usa AsyncStorage (React Native) ou localStorage (Web)
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

// ========== CONTEXT ==========
const RecipesContext = createContext();

// ========== CONSTANTS ==========
const STORAGE_KEY = '@cookle_created_recipes'; // Chave para armazenar receitas criadas
const API_BASE = 'http://localhost:5000'; // URL base da API

// ========== PROVIDER ==========
export function RecipesProvider({ children }) {
  // ========== STATE ==========
  const [recipes, setRecipes] = useState([]); // Receitas da API
  const [createdRecipes, setCreatedRecipes] = useState([]); // Receitas criadas localmente
  const [loading, setLoading] = useState(true); // Estado de carregamento

  // ========== LIFECYCLE ==========
  // Carrega receitas criadas e da API ao inicializar
  useEffect(() => {
    loadCreatedRecipes();
    loadApiRecipes();
  }, []);

  // ========== LOAD CREATED RECIPES ==========
  // Carrega receitas criadas do armazenamento local
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

  // ========== LOAD API RECIPES ==========
  // Busca receitas da API externa
  const loadApiRecipes = async () => {
    try {
      console.log('RecipesContext: loadApiRecipes - iniciando requisição para', `${API_BASE}/recipes`);
      const response = await fetch(`${API_BASE}/recipes`);
      console.log('RecipesContext: loadApiRecipes - resposta recebida, status:', response.status);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar receitas da API');
      }
      const data = await response.json();
      console.log('RecipesContext: loadApiRecipes - dados recebidos:', data);
      
      const recipeArray = Array.isArray(data) ? data : (data.recipes || data.data || []);
      console.log('RecipesContext: loadApiRecipes - array de receitas:', recipeArray.length, 'receitas');
      
      setRecipes(recipeArray);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
      setLoading(false);
    }
  };

  // ========== GET ALL RECIPES ==========
  // Combina receitas criadas + receitas da API
  const getAllRecipes = () => {
    return [...createdRecipes, ...recipes];
  };

  // ========== ADD RECIPE ==========
  // Adiciona uma nova receita criada pelo usuário
  const addRecipe = async (recipeData) => {
    try {
      // Gera ID único baseado em timestamp
      const newRecipe = {
        id: Date.now().toString(),
        ...recipeData,
        isCreated: true,
        createdAt: new Date().toISOString(),
      };

      // Atualiza estado local
      const updated = [newRecipe, ...createdRecipes];
      setCreatedRecipes(updated);

      console.log('RecipesContext: addRecipe - persisting', { newRecipe });
      
      // Persiste no armazenamento
      await storage.setItem(STORAGE_KEY, JSON.stringify(updated));

      console.log('RecipesContext: addRecipe - persisted successfully');

      return newRecipe;
    } catch (error) {
      console.error('Erro ao adicionar receita:', error);
      throw error;
    }
  };

  // ========== DELETE RECIPE ==========
  // Remove uma receita criada pelo usuário
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

  // ========== UPDATE RECIPE ==========
  // Atualiza uma receita existente
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

  // ========== GET RECIPE BY ID ==========
  // Busca uma receita específica por ID (prioriza receitas criadas)
  const getRecipeById = (id) => {
    const created = createdRecipes.find(r => r.id === id);
    if (created) return created;

    return recipes.find(r => r.id === id);
  };

  // ========== PROVIDER VALUE ==========
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

// ========== CUSTOM HOOK ==========
// Hook para acessar o contexto de receitas
export function useRecipes() {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error('useRecipes deve ser usado dentro de um RecipesProvider');
  }
  return context;
}
