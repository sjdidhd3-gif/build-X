import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Alert,
  Modal,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AttachmentMenu from '../components/AttachmentMenu';
import AdBanner from '../components/AdBanner';
import AIService from '../services/AIService';

const { width, height } = Dimensions.get('window');

const ChatScreen = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAPIKey, setHasAPIKey] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState('idle');
  const [recording, setRecording] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingPermission, setRecordingPermission] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollViewRef = useRef();
  const recordingAnimation = useRef(new Animated.Value(1)).current;
  
  const { userType = 'guest', email = '', name = 'ضيف', userPoints = 293 } = route.params || {};
  const chatId = route?.params?.chatId || 'default';

  useEffect(() => {
    initializeChat();
    checkAPIKey();
    requestRecordingPermission();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // طلب إذن التسجيل الصوتي
  const requestRecordingPermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      setRecordingPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert('تنبيه', 'نحتاج إلى إذن الوصول للميكروفون لتفعيل ميزة تحويل الصوت إلى نص');
      }
    } catch (error) {
      console.error('خطأ في طلب إذن التسجيل:', error);
    }
  };
  
  // بدء التسجيل الصوتي
  const startRecording = async () => {
    try {
      if (!recordingPermission) {
        await requestRecordingPermission();
        if (!recordingPermission) return;
      }
      
      // إعداد جلسة التسجيل
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      // إنشاء تسجيل جديد
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(newRecording);
      setRecordingStatus('recording');
      setIsRecording(true);
      
      // بدء تحريك الرسوم المتحركة
      startRecordingAnimation();
      
      // بدء عداد المدة
      const interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      // تخزين المؤقت في الكائن للتمكن من إيقافه لاحقاً
      newRecording._interval = interval;
      
    } catch (error) {
      console.error('خطأ في بدء التسجيل:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء بدء التسجيل');
      setIsRecording(false);
    }
  };
  
  // إيقاف التسجيل الصوتي
  const stopRecording = async () => {
    try {
      if (!recording) return;
      
      // إيقاف عداد المدة
      if (recording._interval) {
        clearInterval(recording._interval);
      }
      
      // إيقاف التسجيل
      await recording.stopAndUnloadAsync();
      
      // إعادة وضع الصوت
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      
      // الحصول على URI للتسجيل
      const uri = recording.getURI();
      
      // إيقاف الرسوم المتحركة
      stopRecordingAnimation();
      
      // إعادة تعيين الحالة
      setRecordingStatus('stopped');
      setIsRecording(false);
      
      // محاكاة تحويل الصوت إلى نص (في التطبيق الحقيقي، سنستخدم خدمة تحويل الصوت إلى نص)
      simulateTranscription();
      
      setRecording(null);
      setRecordingDuration(0);
      
    } catch (error) {
      console.error('خطأ في إيقاف التسجيل:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء إيقاف التسجيل');
      setIsRecording(false);
      setRecordingDuration(0);
    }
  };
  
  // محاكاة تحويل الصوت إلى نص
  const simulateTranscription = () => {
    setIsLoading(true);
    
    // في التطبيق الحقيقي، سنرسل التسجيل إلى خدمة تحويل الصوت إلى نص
    // هنا نقوم بمحاكاة ذلك بتأخير بسيط
    setTimeout(() => {
      const exampleTexts = [
        'مرحباً، كيف يمكنني مساعدتك اليوم؟',
        'أريد معلومات عن الذكاء الاصطناعي',
        'هل يمكنك مساعدتي في كتابة مقال؟',
        'أبحث عن معلومات حول برمجة تطبيقات الهاتف المحمول',
        'كيف يمكنني تعلم لغة البرمجة بايثون؟'
      ];
      
      const randomText = exampleTexts[Math.floor(Math.random() * exampleTexts.length)];
      setInputText(randomText);
      setTranscribedText(randomText);
      setIsLoading(false);
    }, 1500);
  };
  
  // تحريك زر التسجيل
  const startRecordingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(recordingAnimation, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(recordingAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };
  
  // إيقاف تحريك زر التسجيل
  const stopRecordingAnimation = () => {
    recordingAnimation.stopAnimation();
    Animated.timing(recordingAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  
  // التمرير لأعلى الشاشة
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };
  
  // التعامل مع حدث التمرير
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollButton(offsetY > height * 0.5);
  };

  const initializeChat = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem(`chat_${chatId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // رسالة ترحيب افتراضية
        const welcomeMessage = {
          id: Date.now(),
          text: 'مرحباً! أنا Build X، مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟',
          isBot: true,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
        await saveMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('خطأ في تحميل المحادثة:', error);
    }
  };

  const checkAPIKey = async () => {
    const hasKey = await AIService.loadAPIKey();
    setHasAPIKey(hasKey);
  };

  const saveMessages = async (messagesToSave) => {
    try {
      await AsyncStorage.setItem(`chat_${chatId}`, JSON.stringify(messagesToSave));
    } catch (error) {
      console.error('خطأ في حفظ المحادثة:', error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isBot: false,
      timestamp: new Date(),
      image: selectedImage,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      if (!hasAPIKey) {
        // رد افتراضي إذا لم يكن هناك API key
        const botResponse = {
          id: Date.now() + 1,
          text: 'لاستخدام الذكاء الاصطناعي، يرجى إعداد مفتاح API من الإعدادات. يمكنك الحصول على مفتاح مجاني من OpenAI أو Google AI.',
          isBot: true,
          timestamp: new Date(),
        };
        const finalMessages = [...newMessages, botResponse];
        setMessages(finalMessages);
        await saveMessages(finalMessages);
      } else {
        let response;
        if (selectedImage) {
          // تحليل الصورة
          response = await AIService.analyzeImage(selectedImage, inputText.trim() || 'صف هذه الصورة');
        } else {
          // رسالة نصية عادية
          response = await AIService.sendMessage(inputText.trim(), messages);
        }

        const botResponse = {
          id: Date.now() + 1,
          text: response,
          isBot: true,
          timestamp: new Date(),
        };

        const finalMessages = [...newMessages, botResponse];
        setMessages(finalMessages);
        await saveMessages(finalMessages);
      }
    } catch (error) {
      console.error('خطأ في إرسال الرسالة:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: `عذراً، حدث خطأ: ${error.message}. يرجى المحاولة مرة أخرى أو التحقق من إعدادات API.`,
        isBot: true,
        timestamp: new Date(),
        isError: true,
      };
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      await saveMessages(finalMessages);
    }

    setIsLoading(false);
  };

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('خطأ', 'نحتاج إذن الوصول للصور');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].base64);
        setShowAttachmentMenu(false);
      }
    } catch (error) {
      Alert.alert('خطأ', 'فشل في اختيار الصورة');
    }
  };

  const handleCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('خطأ', 'نحتاج إذن الوصول للكاميرا');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].base64);
        setShowAttachmentMenu(false);
      }
    } catch (error) {
      Alert.alert('خطأ', 'فشل في التقاط الصورة');
    }
  };

  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        Alert.alert('تم', `تم اختيار الملف: ${result.assets[0].name}`);
        setShowAttachmentMenu(false);
      }
    } catch (error) {
      Alert.alert('خطأ', 'فشل في اختيار الملف');
    }
  };

  const clearChat = () => {
    Alert.alert(
      'مسح المحادثة',
      'هل أنت متأكد من مسح جميع الرسائل؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'مسح',
          style: 'destructive',
          onPress: async () => {
            setMessages([]);
            await AsyncStorage.removeItem(`chat_${chatId}`);
          }
        }
      ]
    );
  };

  const openAPISettings = () => {
    navigation.navigate('APISettings');
  };

  const renderMessage = (item, index) => (
    <View key={item.id} style={[
      styles.messageContainer,
      item.isBot ? styles.botMessage : styles.userMessage
    ]}>
      {item.isBot && (
        <View style={styles.botAvatar}>
          <Text style={styles.botAvatarText}>BX</Text>
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        item.isBot ? styles.botBubble : styles.userBubble,
        item.isError && styles.errorBubble
      ]}>
        {item.image && (
          <Image 
            source={{ uri: `data:image/jpeg;base64,${item.image}` }}
            style={styles.messageImage}
          />
        )}
        <Text style={[
          styles.messageText,
          item.isBot ? styles.botText : styles.userText,
          item.isError && styles.errorText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.timestamp,
          item.isBot ? styles.botTimestamp : styles.userTimestamp
        ]}>
          {item.timestamp.toLocaleTimeString('ar-SA', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-forward" size={24} color="#333" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Build X</Text>
            <Text style={styles.headerSubtitle}>
              {hasAPIKey ? 'متصل بالذكاء الاصطناعي' : 'غير متصل'}
            </Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={openAPISettings} style={styles.headerButton}>
              <Ionicons name="settings-outline" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity onPress={clearChat} style={styles.headerButton}>
              <Ionicons name="trash-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {messages.map((item, index) => renderMessage(item, index))}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.loadingText}>جاري الكتابة...</Text>
            </View>
          )}
        </ScrollView>
        
        {/* Scroll to Top Button */}
        {showScrollButton && (
          <TouchableOpacity 
            style={styles.scrollTopButton}
            onPress={scrollToTop}
          >
            <Ionicons name="arrow-up" size={20} color="#fff" />
          </TouchableOpacity>
        )}

        {/* Selected Image Preview */}
        {selectedImage && (
          <View style={styles.imagePreview}>
            <Image 
              source={{ uri: `data:image/jpeg;base64,${selectedImage}` }}
              style={styles.previewImage}
            />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(null)}
            >
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          {!isRecording ? (
            <>
              <TouchableOpacity
                style={styles.attachButton}
                onPress={() => setShowAttachmentMenu(true)}
              >
                <Ionicons name="add" size={24} color="#007AFF" />
              </TouchableOpacity>
              
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="كيف يمكنني مساعدتك؟"
                placeholderTextColor="#999"
                multiline
                maxLength={1000}
                textAlign="right"
              />
              
              {inputText.trim() || selectedImage ? (
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={sendMessage}
                  disabled={isLoading}
                >
                  <Ionicons name="send" size={20} color="#fff" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.micButton}
                  onPress={startRecording}
                  disabled={!recordingPermission}
                >
                  <Ionicons name="mic" size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={styles.recordingContainer}>
              <View style={styles.recordingInfo}>
                <Animated.View 
                  style={[
                    styles.recordingIndicator,
                    { transform: [{ scale: recordingAnimation }] }
                  ]}
                />
                <Text style={styles.recordingText}>
                  جاري التسجيل... {recordingDuration}s
                </Text>
              </View>
              
              <TouchableOpacity
                style={styles.stopRecordingButton}
                onPress={stopRecording}
              >
                <Ionicons name="stop" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Attachment Menu */}
        {showAttachmentMenu && (
          <AttachmentMenu
            onSelect={(type) => {
              setShowAttachmentMenu(false);
              switch (type) {
                case 'camera':
                  handleCamera();
                  break;
                case 'image':
                  handleImagePicker();
                  break;
                case 'document':
                  handleDocumentPicker();
                  break;
                case 'video':
                  Alert.alert('قريباً', 'ميزة الفيديو ستكون متاحة قريباً');
                  break;
                case 'voice':
                  startRecording();
                  break;
                case 'enhance':
                  if (inputText.trim()) {
                    const enhancedText = `تحسين: ${inputText.trim()}`;
                    setInputText(enhancedText);
                  } else {
                    Alert.alert('تنبيه', 'يرجى كتابة نص أولاً ليتم تحسينه');
                  }
                  break;
                case 'translate':
                  if (inputText.trim()) {
                    const translationText = `ترجمة: ${inputText.trim()}`;
                    setInputText(translationText);
                  } else {
                    Alert.alert('تنبيه', 'يرجى كتابة نص أولاً ليتم ترجمته');
                  }
                  break;
                case 'slides':
                case 'agent':
                case 'chat':
                  Alert.alert('قريباً', `ميزة ${type} ستكون متاحة قريباً`);
                  break;
                default:
                  Alert.alert('قريباً', 'هذه الميزة ستكون متاحة قريباً');
              }
            }}
            onClose={() => setShowAttachmentMenu(false)}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  botAvatarText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  botBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  errorBubble: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botText: {
    color: '#333',
    textAlign: 'left',
  },
  userText: {
    color: '#fff',
    textAlign: 'right',
  },
  errorText: {
    color: '#d32f2f',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  botTimestamp: {
    color: '#999',
    textAlign: 'left',
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  imagePreview: {
    margin: 16,
    position: 'relative',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  recordingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF0000',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 14,
    color: '#333',
  },
  stopRecordingButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollTopButton: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ChatScreen;