import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Platform,
  Modal,
  FlatList,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useRecipes } from '../contexts/RecipesContext';

const CATEGORIES = ['Entrada', 'Prato Principal', 'Sobremesa', 'Bebida', 'Aperitivo'];
const CUISINES = ['Italiana', 'Brasileira', 'Francesa', 'Chinesa', 'Japonesa', 'Tailandesa', 'Mexicana', 'Americana'];
const PREP_TIMES = ['15 min', '30 min', '45 min', '1h', '1h30', '2h', '3h', '4h+'];
const PORTIONS = ['1', '2', '3', '4', '5', '6', '8', '10'];

export default function Create() {
  const router = useRouter();
  const { addRecipe } = useRecipes();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [portions, setPortions] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Por favor, digite o nome da receita');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Atenção', 'Por favor, digite a descrição');
      return false;
    }
    if (!category) {
      Alert.alert('Atenção', 'Por favor, selecione a categoria');
      return false;
    }
    if (!country) {
      Alert.alert('Atenção', 'Por favor, selecione a culinária');
      return false;
    }
    if (!prepTime) {
      Alert.alert('Atenção', 'Por favor, selecione o tempo de preparo');
      return false;
    }
    if (!portions) {
      Alert.alert('Atenção', 'Por favor, selecione a porção');
      return false;
    }
    if (!ingredients.trim()) {
      Alert.alert('Atenção', 'Por favor, digite os ingredientes');
      return false;
    }
    if (!instructions.trim()) {
      Alert.alert('Atenção', 'Por favor, digite as instruções');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      let timeInMinutes = prepTime;
      if (prepTime.includes('min')) {
        timeInMinutes = parseInt(prepTime.replace(' min', ''));
      } else if (prepTime.includes('h')) {
        if (prepTime === '1h') timeInMinutes = 60;
        else if (prepTime === '1h30') timeInMinutes = 90;
        else if (prepTime === '2h') timeInMinutes = 120;
        else if (prepTime === '3h') timeInMinutes = 180;
        else if (prepTime === '4h+') timeInMinutes = 240;
      }

      const recipeData = {
        name: name.trim(),
        description: description.trim(),
        category: category,
        cuisine: country,
        time: timeInMinutes,
        servings: parseInt(portions),
        ingredients: ingredients.trim(),
        instructions: instructions.trim(),
        imageUrl: imageUrl || 'https://via.placeholder.com/300x200?text=Receita',
        rating: 5,
      };

      await addRecipe(recipeData);

      Alert.alert(
        'Sucesso! ✨',
        'Receita criada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              clearForm();
              router.push('/');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a receita');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const clearForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setCountry("");
    setPrepTime("");
    setPortions("");
    setIngredients("");
    setInstructions("");
    setImageUrl("");
  };

  const handleCancel = () => {
    if (name.trim() || description.trim() || ingredients.trim() || instructions.trim()) {
      Alert.alert(
        'Descartar alterações?',
        'Você tem alterações não salvas. Deseja descartar?',
        [
          {
            text: 'Continuar editando',
            style: 'cancel'
          },
          {
            text: 'Descartar',
            style: 'destructive',
            onPress: () => router.back()
          }
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleCancel}
          disabled={saving}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Receita</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="restaurant" size={40} color="#A7333F" />
            </View>
          </View>

          <Text style={styles.instruction}>
            Compartilhe sua receita favorita! 🍳
          </Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              <Ionicons name="text-outline" size={16} color="#A7333F" />
              {' '}Nome da Receita *
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Bolo de Chocolate..."
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
              editable={!saving}
              maxLength={100}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              <Ionicons name="document-text-outline" size={16} color="#A7333F" />
              {' '}Descrição *
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva brevemente sua receita..."
              placeholderTextColor="#9ca3af"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              editable={!saving}
              maxLength={200}
            />
            <Text style={styles.charCount}>
              {description.length}/200 caracteres
            </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              <Ionicons name="pricetag-outline" size={16} color="#A7333F" />
              {' '}Categoria *
            </Text>
            <TouchableOpacity 
              style={styles.select}
              onPress={() => setModalOpen('category')}
              disabled={saving}
            >
              <Text style={[styles.selectText, !category && styles.placeholderText]}>
                {category || "Selecione a categoria"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#A7333F" />
            </TouchableOpacity>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              <Ionicons name="globe-outline" size={16} color="#A7333F" />
              {' '}Culinária *
            </Text>
            <TouchableOpacity 
              style={styles.select}
              onPress={() => setModalOpen('cuisine')}
              disabled={saving}
            >
              <Text style={[styles.selectText, !country && styles.placeholderText]}>
                {country || "Selecione o país de origem"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#A7333F" />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={[styles.fieldContainer, styles.halfWidth]}>
              <Text style={styles.label}>
                <Ionicons name="time-outline" size={16} color="#A7333F" />
                {' '}Tempo *
              </Text>
              <TouchableOpacity 
                style={styles.select}
                onPress={() => setModalOpen('time')}
                disabled={saving}
              >
                <Text style={[styles.selectText, !prepTime && styles.placeholderText]}>
                  {prepTime || "Tempo"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#A7333F" />
              </TouchableOpacity>
            </View>

            <View style={[styles.fieldContainer, styles.halfWidth]}>
              <Text style={styles.label}>
                <Ionicons name="people-outline" size={16} color="#A7333F" />
                {' '}Porções *
              </Text>
              <TouchableOpacity 
                style={styles.select}
                onPress={() => setModalOpen('portions')}
                disabled={saving}
              >
                <Text style={[styles.selectText, !portions && styles.placeholderText]}>
                  {portions || "Qtd"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#A7333F" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              <Ionicons name="basket-outline" size={16} color="#A7333F" />
              {' '}Ingredientes *
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Liste os ingredientes (um por linha)..."
              placeholderTextColor="#9ca3af"
              value={ingredients}
              onChangeText={setIngredients}
              multiline
              numberOfLines={5}
              editable={!saving}
              maxLength={1000}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              <Ionicons name="list-outline" size={16} color="#A7333F" />
              {' '}Modo de Preparo *
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva o passo a passo..."
              placeholderTextColor="#9ca3af"
              value={instructions}
              onChangeText={setInstructions}
              multiline
              numberOfLines={5}
              editable={!saving}
              maxLength={2000}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              <Ionicons name="image-outline" size={16} color="#A7333F" />
              {' '}Imagem (Opcional)
            </Text>
            <TouchableOpacity 
              style={styles.imageUpload}
              onPress={pickImage}
              disabled={saving}
            >
              {imageUrl ? (
                <View style={styles.imagePreview}>
                  <Ionicons name="checkmark-circle" size={40} color="#10b981" />
                  <Text style={styles.imageSelectedText}>Imagem selecionada ✓</Text>
                </View>
              ) : (
                <>
                  <Ionicons name="camera-outline" size={32} color="#A7333F" />
                  <Text style={styles.imageUploadText}>Selecionar da Galeria</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={saving ? "hourglass-outline" : "checkmark-circle"} 
                size={24} 
                color="white" 
              />
              <Text style={styles.saveButtonText}>
                {saving ? 'Salvando...' : 'Salvar Receita'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={saving}
              activeOpacity={0.8}
            >
              <Ionicons name="close-circle-outline" size={24} color="#6b7280" />
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>

      <PickerModal
        visible={modalOpen === 'category'}
        options={CATEGORIES}
        value={category}
        onSelect={(value) => {
          setCategory(value);
          setModalOpen(null);
        }}
        onClose={() => setModalOpen(null)}
        title="Selecione a Categoria"
      />

      <PickerModal
        visible={modalOpen === 'cuisine'}
        options={CUISINES}
        value={country}
        onSelect={(value) => {
          setCountry(value);
          setModalOpen(null);
        }}
        onClose={() => setModalOpen(null)}
        title="Selecione a Culinária"
      />

      <PickerModal
        visible={modalOpen === 'time'}
        options={PREP_TIMES}
        value={prepTime}
        onSelect={(value) => {
          setPrepTime(value);
          setModalOpen(null);
        }}
        onClose={() => setModalOpen(null)}
        title="Selecione o Tempo de Preparo"
      />

      <PickerModal
        visible={modalOpen === 'portions'}
        options={PORTIONS}
        value={portions}
        onSelect={(value) => {
          setPortions(value);
          setModalOpen(null);
        }}
        onClose={() => setModalOpen(null)}
        title="Selecione a Porção"
      />
    </View>
  );
}

function PickerModal({ visible, options, value, onSelect, onClose, title }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={modalStyles.container}>
        <View style={modalStyles.content}>
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  modalStyles.option,
                  value === item && modalStyles.optionSelected,
                ]}
                onPress={() => onSelect(item)}
              >
                <Text
                  style={[
                    modalStyles.optionText,
                    value === item && modalStyles.optionTextSelected,
                  ]}
                >
                  {item}
                </Text>
                {value === item && (
                  <Ionicons name="checkmark" size={20} color="#A7333F" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  optionSelected: {
    backgroundColor: '#FFF0F2',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#A7333F',
    fontWeight: 'bold',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: "#A7333F",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: "#FFF",
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF0F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  fieldContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 5,
  },
  select: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectText: {
    fontSize: 16,
    color: '#1f2937',
  },
  placeholderText: {
    color: '#9ca3af',
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
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  imageUploadText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 10,
  },
  imagePreview: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageSelectedText: {
    fontSize: 16,
    color: '#10b981',
    marginTop: 10,
    fontWeight: '600',
  },
  buttonsContainer: {
    gap: 15,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#A7333F",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginLeft: 10,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginLeft: 10,
  },
  bottomSpacer: {
    height: 100,
  },
});
