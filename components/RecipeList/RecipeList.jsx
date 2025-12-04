import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useMemo } from 'react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useRecipes } from '../../contexts/RecipesContext';
import { useRouter } from 'expo-router';

export default function RecipeList({ searchQuery = "" }) {
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { getAllRecipes, loadApiRecipes, createdRecipes } = useRecipes();
  const router = useRouter();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      await loadApiRecipes();
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combinar receitas criadas + API
  const recipes = useMemo(() => {
    return getAllRecipes();
  }, [createdRecipes]);

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
        <Text>Carregando receitas...</Text>
      </View>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Receitas</Text>
        <Text>Nenhuma receita encontrada.</Text>
        <Text style={{ fontSize: 10, color: '#999', marginTop: 10 }}>
          Verifique se a API está rodando em http://localhost:5000
        </Text>
      </View>
    );
  }

  // Mostrar mensagem se a pesquisa não retornar resultados
  if (searchQuery.trim() && filteredRecipes.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Receitas</Text>
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
      <Text style={styles.sectionTitle}>
        Receitas ({filteredRecipes.length})
        {searchQuery.trim() && <Text style={styles.searchIndicator}> - "{searchQuery}"</Text>}
      </Text>
      {renderRows()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  searchIndicator: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#A7333F',
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