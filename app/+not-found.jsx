// ========== IMPORTS ==========
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Stack } from "expo-router";

// ========== COMPONENTE 404 ==========
export default function NotFound() {
  // ========== STATE & HOOKS ==========
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null; // ou um loading spinner
  }

  // ========== HANDLERS ==========
  const handleGoHome = () => {
    router.push("/");
  };

  // ========== RENDER ==========
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Imagem do chef */}
          <Image 
            source={require('../public/images/littleCheff.png')} 
            style={styles.chefImage}
            resizeMode="contain"
          />
          
          {/* Título */}
          <Text style={styles.title}>404 - Página não encontrada</Text>
          
          {/* Subtítulo */}
          <Text style={styles.subtitle}>A página que você procura não existe</Text>
          
          {/* Botão */}
          <TouchableOpacity 
            style={styles.button}
            onPress={handleGoHome}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Voltar para Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

// ========== STYLES ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  chefImage: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontFamily: "Poppins_600SemiBold",
    color: "#A7333F",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: "#A7333F",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#A7333F",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
  },
});
