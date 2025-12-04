// Importa o componente de navegação por abas do Expo Router
import { Tabs } from "expo-router";
// Importa os ícones
import { Ionicons } from "@expo/vector-icons";
import { FavoritesProvider } from "../contexts/FavoritesContext";
import { RecipesProvider } from "../contexts/RecipesContext";

export default function Layout() {
  return (
    <RecipesProvider>
      <FavoritesProvider>
      <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#fff",
        tabBarShowLabel: false,
        // Estilizações da barra inferior (tabs)
        tabBarStyle: {
          backgroundColor: "#A7333F",
          height: 70,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: 10,
          paddingTop: 10,
          position: "absolute",
          borderTopWidth: 0,
        },
      }}
    >
      {/* Tela inicial (Home) */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      {/* Tela de Favoritos */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
      />

      {/* Tela de Criação de Receita */}
      <Tabs.Screen
        name="create"
        options={{
          title: "Criar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" color={color} size={size} />
          ),
        }}
      />

      {/* Tela de Perfil do Usuário */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />

      {/* Chat (exibido como quinta aba) */}
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble" color={color} size={size} />
          ),
        }}
      />

      {/* Not exposing +not-found explicitly here to avoid duplicate screen names.
          The filesystem already provides the +not-found route. If you want a
          dedicated tab that opens a 404-like screen, I can create a separate
          route (e.g. `notfound.jsx`) and add it as a tab to avoid conflicts. */}

      {/* Tela de Detalhes da Receita - Oculta da navegação mas mantém tabs */}
      <Tabs.Screen
        name="recipe/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
    </FavoritesProvider>
    </RecipesProvider>
  );
}
