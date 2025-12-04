import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useRecipes } from '../../contexts/RecipesContext';
import { useRouter } from 'expo-router';

// ========== COMPONENT ==========
// Card destacado que mostra uma receita popular na tela inicial
export default function RecipeCard() {
  // ========== STATE ==========
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ========== HOOKS ==========
  const { toggleFavorite, isFavorite } = useFavorites();
  const { recipes, createdRecipes, loadApiRecipes } = useRecipes();
  const router = useRouter();

  // ========== LIFECYCLE ==========
  useEffect(() => {
    fetchTopRecipe();
  }, []);

  // ========== FETCH TOP RECIPE ==========
  // Busca receita em destaque: prioriza receitas criadas, depois API
  const fetchTopRecipe = async () => {
    try {
      // Prioriza receitas criadas pelo usuário
      if (createdRecipes.length > 0) {
        setRecipe(createdRecipes[0]);
        setLoading(false);
        return;
      }

      // Busca da API se não houver receitas criadas
      await loadApiRecipes();
      
      if (recipes.length > 0) {
        setRecipe(recipes[0]);
      } else {
        // Fallback: busca receita específica se a lista estiver vazia
        try {
          const response = await fetch('http://localhost:5000/recipes/43');
          const data = await response.json();
          setRecipe(data);
        } catch (error) {
          console.error('Erro ao buscar receita específica:', error);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar receita:', error);
    } finally {
      setLoading(false);
    }
  };

  // ========== LOADING STATE ==========
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A7333F" />
      </View>
    );
  }

  // ========== EMPTY STATE ==========
  if (!recipe) {
    return null;
  }

  // ========== RENDER ==========
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Receita Popular</Text>
      
      {/* Card principal da receita */}
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push(`/recipe/${recipe.id}`)}
        activeOpacity={0.8}
      >
        {/* Imagem da receita */}
        <Image 
          source={{ uri: recipe.imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Botão de favoritar */}
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(recipe);
          }}
        >
          <Ionicons 
            name={isFavorite(recipe.id) ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite(recipe.id) ? "#A7333F" : "#fff"} 
          />
        </TouchableOpacity>

        {/* Badge de avaliação */}
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>
            ({recipe.rating}) 1.5K Review
          </Text>
        </View>

        {/* Conteúdo: título e informações */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {recipe.name}
          </Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={18} color="#666" />
              <Text style={styles.infoText}>{recipe.time} min</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="restaurant-outline" size={18} color="#666" />
              <Text style={styles.infoText}>{recipe.category}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="globe-outline" size={18} color="#666" />
              <Text style={styles.infoText}>{recipe.cuisine}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// ========== STYLES ==========
const styles = StyleSheet.create({
  // Container principal
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },

  // ========== LOADING STATE ==========
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ========== CARD STYLES ==========
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 180,
  },

  // ========== OVERLAY ELEMENTS ==========
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },

  // ========== CARD CONTENT ==========
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
  },
});