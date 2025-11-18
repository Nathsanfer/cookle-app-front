// Importa o componente de navegação por abas do Expo Router
import { Tabs } from "expo-router";
// Importa os ícones
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
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

      {/* Tela 404 - Oculta da navegação e sem tabs */}
      <Tabs.Screen
        name="+not-found"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
