import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>

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
          />
          <TouchableOpacity style={styles.filterButton}>
            <Image source={require('../public/icons/filtro.png')} style={styles.filterIcon} />
          </TouchableOpacity>
        </View>
        
      </View>

      <Text style={styles.text}>Tela de Início 🏠</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
});