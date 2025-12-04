// Configuração da API
export const API_BASE = "http://localhost:5000";

// Endpoints
export const API_ENDPOINTS = {
  recipes: `${API_BASE}/recipes`,
  recipeDetail: (id) => `${API_BASE}/recipes/${id}`,
};

// Informações da aplicação
export const APP_INFO = {
  name: "Cookle",
  version: "1.0.0",
  description: "App de receitas com Expo + React Native",
};
