import { View, Text, StyleSheet, ScrollView } from "react-native";

import RecipeCard from "../components/RecipeCard/RecipeCard";

export default function Favorites() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Favoritos 💖</Text>
      </View>

      <RecipeCard />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#A7333F',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: { 
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});