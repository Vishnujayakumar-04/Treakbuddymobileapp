import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowBackIcon } from '../components/icons';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { auth } from '../firebase/auth';
import {
  sendAIMessage,
  getChatHistory,
  subscribeToChatHistory,
  ChatMessage
} from '../utils/firebaseAI';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

// ChatMessage interface is imported from firebaseAI

interface AIChatbotScreenProps {
  navigation?: any;
}

export default function AIChatbotScreen({ navigation }: AIChatbotScreenProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!auth.currentUser) {
      Alert.alert('Login Required', 'Please login to use AI Assistant', [
        { text: 'OK', onPress: () => navigation?.goBack() },
      ]);
      return;
    }

    // Load chat history from Firestore
    loadChatHistory();

    // Subscribe to real-time updates
    const unsubscribe = setupChatSubscription();

    // Listen to auth state changes
    const authUnsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigation?.goBack();
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
      authUnsubscribe();
    };
  }, []);

  const loadChatHistory = async () => {
    if (!auth.currentUser) return;

    try {
      setLoadingHistory(true);
      const history = await getChatHistory(auth.currentUser.uid);
      setMessages(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const setupChatSubscription = () => {
    if (!auth.currentUser) return () => { };

    try {
      return subscribeToChatHistory(auth.currentUser.uid, (messages) => {
        setMessages(messages);
        setLoadingHistory(false);
      });
    } catch (error) {
      console.error('Error setting up chat subscription:', error);
      setLoadingHistory(false);
      return () => { };
    }
  };

  const handleAskAI = async () => {
    if (!input.trim()) {
      return;
    }

    if (!auth.currentUser) {
      Alert.alert('Login Required', 'Please login to use AI Assistant');
      return;
    }

    // Check internet connection (basic check)
    // Note: For production, install @react-native-community/netinfo
    // For now, we'll catch network errors in the try-catch

    const question = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      question,
      answer: '',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Get AI response and save to Firestore using Firebase AI service
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const { answer: aiReply, messageId } = await sendAIMessage(
        auth.currentUser.uid,
        question
      );

      // Update message with answer
      const updatedMessage: ChatMessage = {
        ...userMessage,
        id: messageId,
        answer: aiReply,
      };
      setMessages((prev) => prev.map((msg) => (msg.id === userMessage.id ? updatedMessage : msg)));
    } catch (error: any) {
      console.error('Error getting AI response:', error);

      // Check if it's a network error
      const errorMessage = error.message || '';
      if (errorMessage.includes('Network') || errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch')) {
        Alert.alert('No Internet', 'Please check your internet connection and try again.');
      } else {
        Alert.alert('Error', errorMessage || 'Failed to get AI response. Please try again.');
      }

      // Remove the message if it failed
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  if (loadingHistory) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0E7C86" />
          <Text style={styles.loadingText}>Loading chat history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowBackIcon size={24} color="#000000" />
          </TouchableOpacity>
          <View style={styles.headerAvatarContainer}>
            <Text style={styles.headerAvatar}>🤖</Text>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Pondy AI Assistant</Text>
            <Text style={styles.headerSubtitle}>Always here to help</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyIcon}>✨</Text>
              </View>
              <Text style={styles.emptyTitle}>How can I help you today?</Text>
              <Text style={styles.emptyText}>
                Ask me about places to visit, best restaurants, or hidden gems in Puducherry!
              </Text>
            </View>
          ) : (
            messages.map((message) => (
              <View key={message.id}>
                {/* User Question */}
                <View style={styles.userMessageContainer}>
                  <View style={styles.userMessage}>
                    <Text style={styles.userMessageText}>{message.question}</Text>
                  </View>
                </View>

                {/* AI Answer */}
                {message.answer ? (
                  <View style={styles.aiMessageRow}>
                    <View style={styles.aiAvatarSmall}>
                      <Text style={styles.aiAvatarTextSmall}>🤖</Text>
                    </View>
                    <View style={styles.aiMessageContainer}>
                      <View style={styles.aiMessage}>
                        <Text style={styles.aiMessageText}>{message.answer}</Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.aiMessageRow}>
                    <View style={styles.aiAvatarSmall}>
                      <Text style={styles.aiAvatarTextSmall}>🤖</Text>
                    </View>
                    <View style={styles.aiMessageContainer}>
                      <View style={styles.aiMessageLoading}>
                        <ActivityIndicator size="small" color="#0E7C86" />
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))
          )}
          {isLoading && (
            <View style={styles.aiMessageRow}>
              <View style={styles.aiAvatarSmall}>
                <Text style={styles.aiAvatarTextSmall}>🤖</Text>
              </View>
              <View style={styles.aiMessageContainer}>
                <View style={styles.aiMessageLoading}>
                  <ActivityIndicator size="small" color="#0E7C86" />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ask me anything..."
              placeholderTextColor="#9ca3af"
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!input.trim() || isLoading) ? styles.sendButtonDisabled : styles.sendButtonActive
              ]}
              onPress={handleAskAI}
              activeOpacity={0.8}
              disabled={!input.trim() || isLoading}
            >
              <Feather name="arrow-up" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.bodyMedium,
    color: '#666666',
    marginTop: spacing.md,
  },
  header: {
    paddingTop: STATUSBAR_HEIGHT + spacing.sm,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerAvatar: {
    fontSize: 20,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    color: '#0f172a',
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.lg,
  },
  userMessage: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    borderBottomRightRadius: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    maxWidth: '80%',
    ...shadows.sm,
  },
  userMessageText: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  aiMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  aiAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  aiAvatarTextSmall: {
    fontSize: 14,
  },
  aiMessageContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  aiMessage: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    maxWidth: '90%',
    ...shadows.sm,
  },
  aiMessageLoading: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: spacing.lg,
    paddingVertical: 16,
    ...shadows.sm,
  },
  aiMessageText: {
    fontSize: 15,
    color: '#1e293b',
    lineHeight: 22,
  },
  inputContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    color: '#0f172a',
    maxHeight: 120,
    minHeight: 40,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  sendButtonActive: {
    backgroundColor: '#0f172a',
  },
  sendButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
});

