import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Platform
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

export default function Create() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [portions, setPortions] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleSave = () => {
    // Lógica para salvar a receita
    console.log("Salvando receita...");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Crie uma Receita!</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Nome */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome da receita..."
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Descrição */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Digite uma breve descrição..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Categoria */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Categoria</Text>
          <TouchableOpacity style={styles.select}>
            <Text style={[styles.selectText, !category && styles.placeholderText]}>
              {category || "Selecione a categoria"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#A7333F" />
          </TouchableOpacity>
        </View>

        {/* Culinária */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Culinária</Text>
          <TouchableOpacity style={styles.select}>
            <Text style={[styles.selectText, !country && styles.placeholderText]}>
              {country || "Selecione o país de origem"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#A7333F" />
          </TouchableOpacity>
        </View>

        {/* Tempo de preparo e Porção */}
        <View style={styles.row}>
          <View style={[styles.fieldContainer, styles.halfWidth]}>
            <Text style={styles.label}>Tempo de preparo</Text>
            <TouchableOpacity style={styles.select}>
              <Text style={[styles.selectText, !prepTime && styles.placeholderText]}>
                {prepTime || "Selecione o tempo"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#A7333F" />
            </TouchableOpacity>
          </View>

          <View style={[styles.fieldContainer, styles.halfWidth]}>
            <Text style={styles.label}>Porção</Text>
            <TouchableOpacity style={styles.select}>
              <Text style={[styles.selectText, !portions && styles.placeholderText]}>
                {portions || "Selecione o valor"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#A7333F" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Ingredientes */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Ingredientes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Digite os ingredientes..."
            placeholderTextColor="#999"
            value={ingredients}
            onChangeText={setIngredients}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Instruções */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Instruções</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Digite as instruções..."
            placeholderTextColor="#999"
            value={instructions}
            onChangeText={setInstructions}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Imagem */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Imagem</Text>
          <TouchableOpacity style={styles.imageUpload}>
            <Ionicons name="cloud-upload-outline" size={24} color="#999" />
            <Text style={styles.imageUploadText}>Selecione o arquivo</Text>
          </TouchableOpacity>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>SALVAR</Text>
        </TouchableOpacity>

        {/* Espaço extra para o tab bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    backgroundColor: "#A7333F",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
    color: "#FFF",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "#A7333F",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#333",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  select: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  halfWidth: {
    flex: 1,
  },
  imageUpload: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  imageUploadText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#999",
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: "#A7333F",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#FFF",
    letterSpacing: 1,
  },
  bottomSpacer: {
    height: 100,
  },
});
