import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useFavorites } from '../../contexts/FavoritesContext';

export default function RecipeCard() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    fetchTopRecipe();
  }, []);

  const fetchTopRecipe = async () => {
    try {
      const response = await fetch('http://localhost:5000/recipes/43');
      const data = await response.json();
      
      setRecipe(data);
    } catch (error) {
      console.error('Erro ao buscar receita:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A7333F" />
      </View>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Receita Popular</Text>
      
      <TouchableOpacity style={styles.card}>
        <Image 
          source={{ uri: recipe.imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(recipe)}
        >
          <Ionicons 
            name={isFavorite(recipe.id) ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite(recipe.id) ? "#A7333F" : "#fff"} 
          />
        </TouchableOpacity>

        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>
            ({recipe.rating}) 1.5K Review
          </Text>
        </View>

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

const styles = StyleSheet.create({
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
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
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