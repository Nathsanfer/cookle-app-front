import { View, Text, StyleSheet } from "react-native";

import RecipeList from "../components/RecipeList/RecipeList";

export default function Profile() {
  return (
    <View style={styles.container}>

      <RecipeList />


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { fontSize: 20 },
});
