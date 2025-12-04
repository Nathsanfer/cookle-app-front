// ========== IMPORTS ==========
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSearchParams } from 'expo-router';

// ========== COMPONENTE PRINCIPAL ==========
export default function Chat() {
  // ========== STATE & PARAMS ==========
  const router = useRouter();
  const [input, setInput] = useState('');
  // useSearchParams may not be available in all environments/versions of expo-router
  // so guard its usage and fallback to parsing window.location.search on web.
  let userParam;
  try {
    if (typeof useSearchParams === 'function') {
      const params = useSearchParams();
      userParam = params?.user;
    }
  } catch (e) {
    userParam = undefined;
  }
  if (!userParam && typeof window !== 'undefined') {
    try {
      const qs = new URLSearchParams(window.location.search);
      userParam = qs.get('user') || undefined;
    } catch (e) {
      userParam = undefined;
    }
  }
  const contactName = userParam ? String(userParam) : 'Amigo';
  const initials = contactName
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // ========== MENSAGENS ==========
  const [messages, setMessages] = useState([
    { id: '1', text: `Oi ${contactName}! Tudo bem? 👋`, from: 'them' },
    { id: '2', text: 'Tudo sim! Tava olhando sua receita, queria uma dica.', from: 'me' },
    { id: '3', text: 'Claro — manda a dúvida que eu te ajudo 🙂', from: 'them' },
  ]);

  const listRef = useRef(null);

  // ========== AUTO-SCROLL ==========
  useEffect(() => {
    if (messages.length === 0) return;
    const ref = listRef.current;
    const t = setTimeout(() => {
      try {
        if (ref && typeof ref.scrollToEnd === 'function') {
          ref.scrollToEnd({ animated: true });
        } else if (ref && typeof ref.scrollToOffset === 'function') {
          // fallback: scroll to a very large offset
          ref.scrollToOffset({ offset: 99999, animated: true });
        }
      } catch (e) {
        // ignore if the ref is no longer valid or method missing
      }
    }, 50);

    return () => clearTimeout(t);
  }, [messages]);

  // ========== ENVIAR MENSAGEM ==========
  function handleSend() {
    if (!input.trim()) return;
    const newMsg = { id: String(Date.now()), text: input.trim(), from: 'me' };
    setMessages((s) => [...s, newMsg]);
    setInput('');
  }

  // ========== RENDERIZAÇÃO DE MENSAGEM ==========
  function renderItem({ item }) {
    const isMe = item.from === 'me';
    return (
      <View style={[styles.msgRow, isMe ? styles.msgRowMe : styles.msgRowThem]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={[styles.msgText, isMe ? styles.msgTextMe : styles.msgTextThem]}>{item.text}</Text>
        </View>
      </View>
    );
  }

  // ========== RENDER ==========
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fffefeff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerLeft}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{contactName}</Text>
            <Text style={styles.headerSubtitle}>Online</Text>
          </View>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escreva uma mensagem..."
          value={input}
          onChangeText={setInput}
          multiline={true}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ========== STYLES ==========
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#A7333F',
    paddingTop: 44,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarInitials: {
    color: '#A7333F',
    fontWeight: '700',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#ffdede',
    fontSize: 12,
  },
  list: {
    padding: 16,
    paddingBottom: 10,
  },
  msgRow: {
    marginVertical: 6,
    flexDirection: 'row',
  },
  msgRowMe: {
    justifyContent: 'flex-end',
  },
  msgRowThem: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  bubbleMe: {
    backgroundColor: '#A7333F',
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontSize: 14,
  },
  msgTextMe: {
    color: '#fff',
  },
  msgTextThem: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f7f7f7',
    borderRadius: 20,
    marginRight: 8,
    fontSize: 14,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#A7333F',
  },
});
