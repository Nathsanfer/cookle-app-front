import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useRecipes } from '../../contexts/RecipesContext';

export default function RecipeDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { getRecipeById, deleteRecipe } = useRecipes();

  useEffect(() => {
    fetchRecipeDetails();
  }, [id]);

  const fetchRecipeDetails = async () => {
    try {
      // Buscar do contexto (que inclui receitas criadas + API)
      const recipeData = getRecipeById(id);
      
      if (recipeData) {
        setRecipe(recipeData);
        setLoading(false);
      } else {
        // Se não encontrar, tentar da API
        const response = await fetch(`http://localhost:5000/recipes/${id}`);
        if (response.ok) {
          const data = await response.json();
          setRecipe(data);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da receita:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Deletar Receita',
      'Tem certeza que deseja deletar esta receita? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              setIsDeleting(true);

              // Deletar a receita do contexto/armazenamento
              await deleteRecipe(id);

              // Se estava nos favoritos, remover também
              if (isFavorite(id) && recipe) {
                try {
                  toggleFavorite(recipe);
                } catch (favErr) {
                  console.warn('Erro ao remover dos favoritos:', favErr);
                }
              }

              // Mostrar sucesso e voltar
              Alert.alert('Sucesso!', 'Receita deletada com sucesso!', [
                {
                  text: 'OK',
                  onPress: () => {
                    setIsDeleting(false);
                    router.back();
                  },
                },
              ]);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar a receita');
              console.error('Erro ao deletar:', error);
              setIsDeleting(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A7333F" />
        <Text style={styles.loadingText}>Carregando receita...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#999" />
        <Text style={styles.errorText}>Receita não encontrada</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Converte a string de ingredientes em array
  const ingredientsList = recipe.ingredients ? recipe.ingredients.split(',').map(i => i.trim()) : [];
  
  // Converte a string de instruções em array (dividindo por ponto final)
  const instructionsList = recipe.instructions ? recipe.instructions.split('.').filter(i => i.trim().length > 0) : [];

  return (
    <View style={styles.container}>
      {/* Header com imagem */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: recipe.imageUrl }} 
          style={styles.headerImage}
          resizeMode="cover"
        />
        
        {/* Botões de navegação */}
        <TouchableOpacity 
          style={styles.backIconButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.favoriteIconButton}
          onPress={() => toggleFavorite(recipe)}
        >
          <Ionicons 
            name={isFavorite(recipe.id) ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite(recipe.id) ? "#A7333F" : "#333"} 
          />
        </TouchableOpacity>

        {recipe.isCreated && (
          <>
            <TouchableOpacity
              style={styles.editIconButton}
              onPress={() => router.push(`/create?id=${recipe.id}`)}
              disabled={isDeleting}
            >
              <Ionicons name="pencil-outline" size={24} color="#3A86FF" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.deleteIconButton}
              onPress={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#FF4444" />
              ) : (
                <Ionicons name="trash-outline" size={24} color="#FF4444" />
              )}
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.shareIconButton}>
          <Ionicons name="share-social-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Conteúdo scrollável */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Card branco com informações principais */}
        <View style={styles.mainCard}>
          {/* Rating */}
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{recipe.rating}</Text>
          </View>

          {/* Título */}
          <Text style={styles.title}>{recipe.name}</Text>

          {/* Autor (simulado) */}
          <View style={styles.authorContainer}>
            <View style={styles.authorInfo}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={20} color="#A7333F" />
              </View>
              <View>
                <Text style={styles.authorName}>Chef Cookle</Text>
                <Text style={styles.authorRole}>Mestre Cuca</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Ionicons name="bookmark-outline" size={20} color="#A7333F" />
            </TouchableOpacity>
          </View>

          {/* Descrição */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>Descrição</Text>
            <Text style={styles.description}>{recipe.description}</Text>
          </View>

          {/* Informações em linha */}
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Ionicons name="time-outline" size={20} color="#A7333F" />
              <Text style={styles.infoValue}>{recipe.time} min</Text>
            </View>
            
            <View style={styles.infoDivider} />
            
            <View style={styles.infoBox}>
              <Ionicons name="restaurant-outline" size={20} color="#A7333F" />
              <Text style={styles.infoValue}>{recipe.cuisine}</Text>
            </View>
            
            <View style={styles.infoDivider} />
            
            <View style={styles.infoBox}>
              <Ionicons name="people-outline" size={20} color="#A7333F" />
              <Text style={styles.infoValue}>{recipe.servings} porções</Text>
            </View>
          </View>
        </View>

        {/* Ingredientes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="basket-outline" size={22} color="#A7333F" />
            <Text style={styles.sectionTitle}>Ingredientes</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{ingredientsList.length}</Text>
            </View>
          </View>
          <View style={styles.ingredientsContainer}>
            {ingredientsList.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Modo de Preparo */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list-outline" size={22} color="#A7333F" />
            <Text style={styles.sectionTitle}>Modo de Preparo</Text>
          </View>
          <View style={styles.instructionsContainer}>
            {instructionsList.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction.trim()}.</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Botão de ação */}
        <TouchableOpacity style={styles.startCookingButton}>
          <Ionicons name="flame" size={24} color="#fff" />
          <Text style={styles.startCookingText}>Começar a Cozinhar</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffefeff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffefeff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffefeff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#A7333F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    height: 280,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  backIconButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  favoriteIconButton: {
    position: 'absolute',
    top: 50,
    right: 70,
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  editIconButton: {
    position: 'absolute',
    top: 50,
    right: 120,
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  deleteIconButton: {
    position: 'absolute',
    top: 50,
    right: 170,
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  shareIconButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#fffefeff',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  mainCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    lineHeight: 30,
  },
  authorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FFF0F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  authorRole: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  followButton: {
    padding: 8,
  },
  descriptionSection: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  infoBox: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  infoDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    backgroundColor: '#fffefeff',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  countBadge: {
    backgroundColor: '#A7333F',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ingredientsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A7333F',
    marginTop: 6,
    marginRight: 12,
  },
  ingredientText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  instructionsContainer: {
    gap: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#A7333F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  startCookingButton: {
    backgroundColor: '#A7333F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 25,
    gap: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  startCookingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
