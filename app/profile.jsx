import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from "../contexts/FavoritesContext";
import { useState } from 'react';

export default function Profile() {
  const { favoriteRecipes } = useFavorites();
  const [activeTab, setActiveTab] = useState('about');

  // Dados simulados do usuário
  const userStats = {
    recipes: 12,
    followers: 245,
    following: 189,
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header com gradiente */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-social-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={50} color="#A7333F" />
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Nome e Bio */}
        <Text style={styles.userName}>Ronald Trevis Scott MC</Text>
        <Text style={styles.userBio}>
          Apaixonado por culinária 🍳{'\n'}
          Explorando sabores do mundo inteiro 🌎
        </Text>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.recipes}</Text>
            <Text style={styles.statLabel}>Receitas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.followers}</Text>
            <Text style={styles.statLabel}>Seguidores</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.following}</Text>
            <Text style={styles.statLabel}>Seguindo</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Ionicons name="person-add-outline" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}>Seguir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Ionicons name="chatbubble-outline" size={18} color="#A7333F" />
            <Text style={styles.secondaryButtonText}>Mensagem</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'about' && styles.activeTab]}
          onPress={() => setActiveTab('about')}
        >
          <Ionicons 
            name="information-circle-outline" 
            size={20} 
            color={activeTab === 'about' ? '#A7333F' : '#999'} 
          />
          <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>
            Sobre
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
        >
          <Ionicons 
            name="heart-outline" 
            size={20} 
            color={activeTab === 'favorites' ? '#A7333F' : '#999'} 
          />
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
            Favoritos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
          onPress={() => setActiveTab('achievements')}
        >
          <Ionicons 
            name="trophy-outline" 
            size={20} 
            color={activeTab === 'achievements' ? '#A7333F' : '#999'} 
          />
          <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
            Conquistas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {activeTab === 'about' && (
          <View style={styles.aboutSection}>
            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Ionicons name="mail-outline" size={20} color="#A7333F" />
                <Text style={styles.infoCardTitle}>Email</Text>
              </View>
              <Text style={styles.infoCardValue}>ronald.scott@cookle.com</Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Ionicons name="location-outline" size={20} color="#A7333F" />
                <Text style={styles.infoCardTitle}>Localização</Text>
              </View>
              <Text style={styles.infoCardValue}>São Paulo, Brasil</Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Ionicons name="calendar-outline" size={20} color="#A7333F" />
                <Text style={styles.infoCardTitle}>Membro desde</Text>
              </View>
              <Text style={styles.infoCardValue}>Janeiro 2024</Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Ionicons name="restaurant-outline" size={20} color="#A7333F" />
                <Text style={styles.infoCardTitle}>Especialidade</Text>
              </View>
              <Text style={styles.infoCardValue}>Culinária Italiana e Brasileira</Text>
            </View>
          </View>
        )}

        {activeTab === 'favorites' && (
          <View style={styles.favoritesSection}>
            <Text style={styles.sectionTitle}>
              {favoriteRecipes.length} receitas favoritas
            </Text>
            {favoriteRecipes.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="heart-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>Nenhuma receita favorita</Text>
              </View>
            ) : (
              <View style={styles.favoritesList}>
                {favoriteRecipes.slice(0, 6).map((recipe, index) => (
                  <View key={index} style={styles.favoriteItem}>
                    <Image 
                      source={{ uri: recipe.imageUrl }} 
                      style={styles.favoriteImage}
                    />
                    <Text style={styles.favoriteName} numberOfLines={2}>
                      {recipe.name}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === 'achievements' && (
          <View style={styles.achievementsSection}>
            <View style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Ionicons name="flame" size={30} color="#FF6B35" />
              </View>
              <Text style={styles.achievementTitle}>Chef Iniciante</Text>
              <Text style={styles.achievementDesc}>Criou sua primeira receita</Text>
            </View>

            <View style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Ionicons name="heart" size={30} color="#A7333F" />
              </View>
              <Text style={styles.achievementTitle}>Colecionador</Text>
              <Text style={styles.achievementDesc}>10 receitas favoritadas</Text>
            </View>

            <View style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Ionicons name="star" size={30} color="#FFD700" />
              </View>
              <Text style={styles.achievementTitle}>Avaliador</Text>
              <Text style={styles.achievementDesc}>Avaliou 20 receitas</Text>
            </View>

            <View style={[styles.achievementCard, styles.lockedAchievement]}>
              <View style={styles.achievementIcon}>
                <Ionicons name="lock-closed" size={30} color="#999" />
              </View>
              <Text style={styles.achievementTitle}>Mestre Chef</Text>
              <Text style={styles.achievementDesc}>Crie 50 receitas</Text>
            </View>
          </View>
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf8f8ff',
  },
  header: {
    backgroundColor: '#A7333F',
    paddingTop: 50,
    paddingBottom: 80,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  settingsButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  shareButton: {
    padding: 8,
  },
  profileCard: {
    backgroundColor: '#fff',
    marginTop: -60,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF0F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#A7333F',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  userBio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A7333F',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#A7333F',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#A7333F',
  },
  secondaryButtonText: {
    color: '#A7333F',
    fontSize: 14,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#FFF0F2',
  },
  tabText: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#A7333F',
    fontWeight: '700',
  },
  tabContent: {
    padding: 20,
    paddingBottom: 100,
  },
  aboutSection: {
    gap: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  infoCardValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    marginLeft: 30,
  },
  favoritesSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
  favoritesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  favoriteItem: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  favoriteImage: {
    width: '100%',
    height: 80,
    backgroundColor: '#f0f0f0',
  },
  favoriteName: {
    fontSize: 11,
    color: '#333',
    padding: 8,
    fontWeight: '500',
  },
  achievementsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  lockedAchievement: {
    opacity: 0.5,
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF9E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
});
