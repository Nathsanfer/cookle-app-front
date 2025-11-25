import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from "../contexts/FavoritesContext";
import { useEffect, useRef } from 'react';

export default function Favorites() {
  const { favoriteRecipes, toggleFavorite, isFavorite } = useFavorites();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [favoriteRecipes.length]);

  const renderRecipeItem = (item) => (
    <View key={item.id} style={styles.card}>
      <Image 
        source={{ uri: item.imageUrl || item.image }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item)}
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
        <Text style={styles.title} numberOfLines={2}>
          {item.name || item.title || 'Sem nome'}
        </Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={14} color="#A7333F" />
            <Text style={styles.infoText}>{item.time || item.prepTime || '0'} min</Text>
          </View>

          {(item.category || item.cuisine) && (
            <View style={styles.infoItem}>
              <Ionicons name="restaurant-outline" size={14} color="#A7333F" />
              <Text style={styles.infoText} numberOfLines={1}>
                {item.category || item.cuisine}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderRows = () => {
    const rows = [];
    for (let i = 0; i < favoriteRecipes.length; i += 2) {
      rows.push(
        <View key={i} style={styles.row}>
          {renderRecipeItem(favoriteRecipes[i])}
          {favoriteRecipes[i + 1] && renderRecipeItem(favoriteRecipes[i + 1])}
        </View>
      );
    }
    return rows;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Meus Favoritos</Text>
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Ionicons name="heart" size={16} color="#A7333F" />
                <Text style={styles.badgeText}>
                  {favoriteRecipes.length} {favoriteRecipes.length === 1 ? 'receita' : 'receitas'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.heartIconContainer}>
            <Ionicons name="heart" size={50} color="rgba(255, 255, 255, 0.2)" />
          </View>
        </View>
      </View>

      {favoriteRecipes.length === 0 ? (
        <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
          <View style={styles.emptyIconWrapper}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="heart-outline" size={60} color="#A7333F" />
            </View>
          </View>
          <Text style={styles.emptyText}>Nenhum favorito ainda</Text>
          <Text style={styles.emptySubtext}>
            Explore receitas incríveis e salve suas{'\n'}preferidas tocando no coração ❤️
          </Text>
          <View style={styles.emptyTipContainer}>
            <Ionicons name="bulb-outline" size={20} color="#A7333F" />
            <Text style={styles.emptyTip}>Dica: Seus favoritos ficam salvos aqui!</Text>
          </View>
        </Animated.View>
      ) : (
        <View style={styles.listContainer}>
          <View style={styles.sortContainer}>
            <Text style={styles.sortText}>Todas as receitas favoritas</Text>
            <TouchableOpacity style={styles.sortButton}>
              <Ionicons name="swap-vertical" size={18} color="#666" />
            </TouchableOpacity>
          </View>
          {renderRows()}
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fcf8f8ff',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 25,
    backgroundColor: '#A7333F',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { 
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A7333F',
  },
  heartIconContainer: {
    opacity: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 30,
  },
  emptyIconWrapper: {
    marginBottom: 24,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF0F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFE0E5',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  emptyTipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FFE8B3',
  },
  emptyTip: {
    fontSize: 13,
    color: '#A7333F',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sortText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sortButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 130,
    backgroundColor: '#f0f0f0',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  ratingContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  ratingText: {
    marginLeft: 3,
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
  },
  content: {
    padding: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    lineHeight: 18,
  },
  infoContainer: {
    flexDirection: 'column',
    gap: 6,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});