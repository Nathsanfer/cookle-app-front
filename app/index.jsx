import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Modal, FlatList } from "react-native";
import { useState } from "react";

import CarouselComponent from "../components/Carousel/Carousel.jsx";
import RecipeCard from "../components/RecipeCard/RecipeCard.jsx";
import RecipeList from "../components/RecipeList/RecipeList.jsx";
import { useRecipes } from "../contexts/RecipesContext.jsx";
import { Ionicons } from "@expo/vector-icons";

const CUISINES = ['Todas', 'Italiana', 'Brasileira', 'Francesa', 'Chinesa', 'Japonesa', 'Tailandesa', 'Mexicana', 'Americana'];

const slides = [
  {
      image: { uri: 'https://receitas123.com/wp-content/uploads/2023/07/massa-italiana.png' }
  },
  {
      image: { uri: 'https://www.guiadasemana.com.br/contentFiles/system/pictures/2015/11/148113/original/tiramisu.jpg' }
  },
  {
      image: { uri: 'https://diariodonordeste.verdesmares.com.br/image/contentid/policy:1.3284198:1664578252/Batata.jpg?f=16x9&h=574&w=1020&$p$f$h$w=825e64e' }
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("Todas");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const { createdRecipes } = useRecipes();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

      <View style={styles.containerHeader}>

        <View style={styles.infoHeader}>
          <Image source={require('../public/images/perfil.png')} style={styles.profileImage} />
          <View style={styles.info}>
            <Text style={styles.name}>Ronald Trevis Scott MC</Text>
            <Text style={styles.textHeader}>O que vamos preparar hoje?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Image source={require('../public/icons/sininho.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Image source={require('../public/icons/lupa.png')} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Pesquise por receitas..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Image source={require('../public/icons/filtro.png')} style={styles.filterIcon} />
            {selectedCuisine !== 'Todas' && (
              <View style={styles.filterBadge} />
            )}
          </TouchableOpacity>
        </View>
        
      </View>

      <CarouselComponent slides={slides} />

      <RecipeCard />

      {/* Seção de Receitas Criadas */}
      {createdRecipes.length > 0 && !searchQuery.trim() && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="create" size={24} color="#A7333F" />
            <Text style={styles.sectionTitleText}>Minhas Receitas</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Receitas que você criou no app</Text>
          <RecipeList searchQuery={searchQuery} recipeType="created" cuisineFilter={selectedCuisine} />
        </View>
      )}

      {/* Seção de Receitas da API */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Ionicons name="restaurant" size={24} color="#A7333F" />
          <Text style={styles.sectionTitleText}>
            {searchQuery.trim() ? 'Resultados da Busca' : 'Receitas Populares'}
          </Text>
        </View>
        {!searchQuery.trim() && (
          <Text style={styles.sectionSubtitle}>
            {selectedCuisine !== 'Todas' ? `Culinária: ${selectedCuisine}` : 'Descubra receitas deliciosas'}
          </Text>
        )}
        <RecipeList searchQuery={searchQuery} recipeType={searchQuery.trim() ? "all" : "api"} cuisineFilter={selectedCuisine} />
      </View>

      {/* Modal de Filtro */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar por Culinária</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={CUISINES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.cuisineOption,
                    selectedCuisine === item && styles.cuisineOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedCuisine(item);
                    setFilterModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.cuisineOptionText,
                      selectedCuisine === item && styles.cuisineOptionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                  {selectedCuisine === item && (
                    <Ionicons name="checkmark-circle" size={24} color="#A7333F" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffefeff',
  },
  scrollContent: {
    paddingBottom: 80, 
  },
  containerHeader: {
    backgroundColor: '#A7333F',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  textHeader: {
    fontSize: 13,
    color: '#fff',
  },
  notificationButton: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A7333F',
  },
  sectionContainer: {
    marginTop: 15,
    marginBottom: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cuisineOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  cuisineOptionSelected: {
    backgroundColor: '#FFF0F2',
  },
  cuisineOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  cuisineOptionTextSelected: {
    color: '#A7333F',
    fontWeight: 'bold',
  },
});