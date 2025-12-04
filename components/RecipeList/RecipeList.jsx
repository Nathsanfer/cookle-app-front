import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useRecipes } from '../../contexts/RecipesContext';
import { useRouter } from 'expo-router';

export default function RecipeList({ searchQuery = "", recipeType = "all" }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { getAllRecipes, createdRecipes, recipes: apiRecipes, loading } = useRecipes();
  const router = useRouter();

  // Selecionar receitas com base no tipo
  const recipes = useMemo(() => {
    if (recipeType === "created") {
      return createdRecipes;
    } else if (recipeType === "api") {
      return apiRecipes;
    } else {
      return getAllRecipes();
    }
  }, [createdRecipes, apiRecipes, recipeType]);

  // Filtrar receitas com base na pesquisa
  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) {
      return recipes;
    }

    const query = searchQuery.toLowerCase().trim();
    
    return recipes.filter(recipe => {
      const name = (recipe.name || recipe.title || '').toLowerCase();
      const cuisine = (recipe.cuisine || recipe.culinaria || recipe.category || '').toLowerCase();
      
      return name.includes(query) || cuisine.includes(query);
    });
  }, [recipes, searchQuery]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A7333F" />
        <Text style={styles.loadingText}>Carregando receitas...</Text>
      </View>
    );
  }

  if (!recipes || recipes.length === 0) {
    // Mensagens diferentes para cada tipo
    let message = "Nenhuma receita encontrada.";
    if (recipeType === "created") {
      message = "Você ainda não criou nenhuma receita.";
    } else if (recipeType === "api") {
      message = "Nenhuma receita disponível da API.";
    }
    
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>{message}</Text>
        {recipeType === "api" && (
          <Text style={styles.apiHint}>
            Verifique se a API está rodando em http://localhost:5000
          </Text>
        )}
      </View>
    );
  }

  // Mostrar mensagem se a pesquisa não retornar resultados
  if (searchQuery.trim() && filteredRecipes.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noResultsText}>
          Nenhuma receita encontrada para "{searchQuery}"
        </Text>
        <Text style={styles.searchHint}>
          Tente pesquisar por nome da receita ou tipo de culinária
        </Text>
      </View>
    );
  }

  const renderRecipeItem = (item) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.card}
      onPress={() => router.push(`/recipe/${item.id}`)}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.imageUrl || item.image }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={(e) => {
          e.stopPropagation();
          toggleFavorite(item);
        }}
      >
        <Ionicons 
          name={isFavorite(item.id) ? "heart" : "heart-outline"} 
          size={20} 
          color={isFavorite(item.id) ? "#A7333F" : "#fff"} 
        />
      </TouchableOpacity>

      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={14} color="#FFD700" />
        <Text style={styles.ratingText}>({item.rating || '0.0'})</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.name || item.title || 'Sem nome'}
        </Text>

        <View style={styles.infoContainer}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{item.time || item.prepTime || '0'} min</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRows = () => {
    const rows = [];
    for (let i = 0; i < filteredRecipes.length; i += 2) {
      rows.push(
        <View key={i} style={styles.row}>
          {renderRecipeItem(filteredRecipes[i])}
          {filteredRecipes[i + 1] && renderRecipeItem(filteredRecipes[i + 1])}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      {renderRows()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginVertical: 20,
  },
  apiHint: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 5,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  searchHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#6b7280',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    width: '48%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 120,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 2,
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 11,
    color: '#666',
  },
});