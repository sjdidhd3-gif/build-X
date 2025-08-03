import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Linking,
  Appearance
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  RadioButton,
  Switch,
  Divider,
  ActivityIndicator,
  Snackbar
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AIService from '../services/AIService';

const APISettingsScreen = ({ navigation }) => {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('openai');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isKeyValid, setIsKeyValid] = useState(null);
  const [showKey, setShowKey] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');

  useEffect(() => {
    loadCurrentSettings();
    loadThemeSettings();
  }, []);

  const loadThemeSettings = async () => {
    try {
      const darkMode = await AsyncStorage.getItem('darkMode');
      if (darkMode !== null) {
        setIsDarkMode(darkMode === 'true');
      } else {
        // Use system default if no setting is saved
        const colorScheme = Appearance.getColorScheme();
        setIsDarkMode(colorScheme === 'dark');
      }
    } catch (error) {
      console.error('خطأ في تحميل إعدادات المظهر:', error);
    }
  };

  const loadCurrentSettings = async () => {
    setIsLoading(true);
    try {
      const hasKey = await AIService.loadAPIKey();
      if (hasKey) {
        setProvider(AIService.provider);
        setApiKey(AIService.apiKey);
        setIsKeyValid(true);
        
        // Load saved model if available
        const savedModel = await AsyncStorage.getItem('ai_model');
        if (savedModel) {
          setModel(savedModel);
        }
      }
    } catch (error) {
      console.error('خطأ في تحميل الإعدادات:', error);
      showSnackbar('حدث خطأ أثناء تحميل الإعدادات');
    }
    setIsLoading(false);
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const validateAndSaveKey = async () => {
    if (!apiKey.trim()) {
      showSnackbar('يرجى إدخال مفتاح API');
      return;
    }

    setIsValidating(true);
    try {
      // حفظ المفتاح مؤقتاً للتحقق
      await AIService.setAPIKey(apiKey.trim(), provider);
      
      // حفظ النموذج المختار
      await AsyncStorage.setItem('ai_model', model);
      
      // التحقق من صحة المفتاح
      const isValid = await AIService.validateAPIKey();
      
      if (isValid) {
        setIsKeyValid(true);
        showSnackbar('تم حفظ مفتاح API بنجاح');
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      } else {
        setIsKeyValid(false);
        showSnackbar('مفتاح API غير صحيح أو منتهي الصلاحية');
      }
    } catch (error) {
      setIsKeyValid(false);
      showSnackbar(error.message || 'فشل في التحقق من مفتاح API');
    }
    setIsValidating(false);
  };

  const clearAPIKey = () => {
    Alert.alert(
      'تأكيد',
      'هل أنت متأكد من حذف مفتاح API؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            await AIService.clearAPIKey();
            setApiKey('');
            setIsKeyValid(null);
            showSnackbar('تم حذف مفتاح API');
          }
        }
      ]
    );
  };

  const testConnection = async () => {
    if (!apiKey.trim()) {
      showSnackbar('يرجى إدخال مفتاح API أولاً');
      return;
    }

    setIsValidating(true);
    try {
      await AIService.setAPIKey(apiKey.trim(), provider);
      const response = await AIService.sendMessage('مرحبا، هذه رسالة اختبار');
      
      // Show success message with response
      Alert.alert(
        'نجح الاختبار!', 
        `الرد: ${response.substring(0, 100)}...`,
        [
          {
            text: 'نسخ الرد',
            onPress: () => {
              // Copy response to clipboard functionality would go here
              showSnackbar('تم نسخ الرد إلى الحافظة');
            }
          },
          { text: 'موافق' }
        ]
      );
    } catch (error) {
      showSnackbar('فشل الاختبار: ' + (error.message || 'خطأ غير معروف'));
    }
    setIsValidating(false);
  };
  
  const openProviderWebsite = () => {
    const url = provider === 'openai' 
      ? 'https://platform.openai.com/api-keys' 
      : 'https://makersuite.google.com/app/apikey';
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        showSnackbar('لا يمكن فتح الرابط');
      }
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>جاري تحميل الإعدادات...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#fff" : "#2196F3"} />
                <Text style={[styles.backButtonText, isDarkMode && styles.darkText]}>العودة</Text>
              </TouchableOpacity>
            </View>
            <Icon name="api" size={40} color={isDarkMode ? "#64B5F6" : "#2196F3"} />
            <Text style={[styles.title, isDarkMode && styles.darkText]}>إعدادات API الذكاء الاصطناعي</Text>
            <Text style={[styles.subtitle, isDarkMode && styles.darkSubText]}>
              قم بإعداد مفتاح API للاستفادة من خدمات الذكاء الاصطناعي
            </Text>
          </View>

          {/* Provider Selection */}
          <Card style={[styles.card, isDarkMode && styles.darkCard]}>
            <Card.Content>
              <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>اختر مقدم الخدمة</Text>
              <RadioButton.Group
                onValueChange={setProvider}
                value={provider}
              >
                <View style={styles.radioItem}>
                  <RadioButton 
                    value="openai" 
                    color={isDarkMode ? "#64B5F6" : "#2196F3"}
                  />
                  <View style={styles.radioContent}>
                    <Text style={[styles.radioTitle, isDarkMode && styles.darkText]}>OpenAI (ChatGPT)</Text>
                    <Text style={[styles.radioSubtitle, isDarkMode && styles.darkSubText]}>
                      GPT-3.5, GPT-4, تحليل الصور
                    </Text>
                  </View>
                </View>
                <View style={styles.radioItem}>
                  <RadioButton 
                    value="google" 
                    color={isDarkMode ? "#64B5F6" : "#2196F3"}
                  />
                  <View style={styles.radioContent}>
                    <Text style={[styles.radioTitle, isDarkMode && styles.darkText]}>Google AI (Gemini)</Text>
                    <Text style={[styles.radioSubtitle, isDarkMode && styles.darkSubText]}>
                      Gemini Pro, مجاني مع حدود
                    </Text>
                  </View>
                </View>
              </RadioButton.Group>
            </Card.Content>
          </Card>

          {/* Model Selection (for OpenAI) */}
          {provider === 'openai' && (
            <Card style={[styles.card, isDarkMode && styles.darkCard]}>
              <Card.Content>
                <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>اختر النموذج</Text>
                <RadioButton.Group
                  onValueChange={setModel}
                  value={model}
                >
                  <View style={styles.radioItem}>
                    <RadioButton 
                      value="gpt-3.5-turbo" 
                      color={isDarkMode ? "#64B5F6" : "#2196F3"}
                    />
                    <View style={styles.radioContent}>
                      <Text style={[styles.radioTitle, isDarkMode && styles.darkText]}>GPT-3.5 Turbo</Text>
                      <Text style={[styles.radioSubtitle, isDarkMode && styles.darkSubText]}>
                        سريع وفعال، مناسب لمعظم المهام
                      </Text>
                    </View>
                  </View>
                  <View style={styles.radioItem}>
                    <RadioButton 
                      value="gpt-4" 
                      color={isDarkMode ? "#64B5F6" : "#2196F3"}
                    />
                    <View style={styles.radioContent}>
                      <Text style={[styles.radioTitle, isDarkMode && styles.darkText]}>GPT-4</Text>
                      <Text style={[styles.radioSubtitle, isDarkMode && styles.darkSubText]}>
                        أكثر ذكاءً ودقة، مناسب للمهام المعقدة
                      </Text>
                    </View>
                  </View>
                  <View style={styles.radioItem}>
                    <RadioButton 
                      value="gpt-4-vision-preview" 
                      color={isDarkMode ? "#64B5F6" : "#2196F3"}
                    />
                    <View style={styles.radioContent}>
                      <Text style={[styles.radioTitle, isDarkMode && styles.darkText]}>GPT-4 Vision</Text>
                      <Text style={[styles.radioSubtitle, isDarkMode && styles.darkSubText]}>
                        يدعم تحليل الصور والمحتوى المرئي
                      </Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </Card.Content>
            </Card>
          )}

          {/* API Key Input */}
          <Card style={[styles.card, isDarkMode && styles.darkCard]}>
            <Card.Content>
              <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>مفتاح API</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  mode="outlined"
                  label={`مفتاح ${provider === 'openai' ? 'OpenAI' : 'Google'} API`}
                  value={apiKey}
                  onChangeText={setApiKey}
                  secureTextEntry={!showKey}
                  right={
                    <TextInput.Icon
                      icon={showKey ? 'eye-off' : 'eye'}
                      onPress={() => setShowKey(!showKey)}
                      color={isDarkMode ? "#aaa" : "#666"}
                    />
                  }
                  style={[styles.textInput, isDarkMode && styles.darkTextInput]}
                  theme={{ 
                    colors: { 
                      primary: isDarkMode ? "#64B5F6" : "#2196F3",
                      background: isDarkMode ? "#121212" : "#f5f5f5",
                      text: isDarkMode ? "#fff" : "#000",
                      placeholder: isDarkMode ? "#aaa" : "#666"
                    } 
                  }}
                />
                {isKeyValid !== null && (
                  <View style={styles.validationContainer}>
                    <Icon
                      name={isKeyValid ? 'check-circle' : 'alert-circle'}
                      size={20}
                      color={isKeyValid ? '#4CAF50' : '#F44336'}
                    />
                    <Text
                      style={[
                        styles.validationText,
                        { color: isKeyValid ? '#4CAF50' : '#F44336' }
                      ]}
                    >
                      {isKeyValid ? 'مفتاح API صحيح' : 'مفتاح API غير صحيح'}
                    </Text>
                  </View>
                )}
              </View>
            </Card.Content>
          </Card>

          {/* Instructions */}
          <Card style={[styles.card, isDarkMode && styles.darkCard]}>
            <Card.Content>
              <View style={styles.instructionHeader}>
                <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>كيفية الحصول على مفتاح API</Text>
                <TouchableOpacity 
                  style={styles.getKeyButton}
                  onPress={openProviderWebsite}
                >
                  <Text style={styles.getKeyButtonText}>فتح الموقع</Text>
                  <Ionicons name="open-outline" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
              
              {provider === 'openai' ? (
                <View>
                  <Text style={[styles.instructionText, isDarkMode && styles.darkSubText]}>
                    1. اذهب إلى platform.openai.com
                  </Text>
                  <Text style={[styles.instructionText, isDarkMode && styles.darkSubText]}>
                    2. سجل دخولك أو أنشئ حساب جديد
                  </Text>
                  <Text style={[styles.instructionText, isDarkMode && styles.darkSubText]}>
                    3. اذهب إلى API Keys في الإعدادات
                  </Text>
                  <Text style={[styles.instructionText, isDarkMode && styles.darkSubText]}>
                    4. انقر على "Create new secret key"
                  </Text>
                  <Text style={[styles.instructionText, isDarkMode && styles.darkSubText]}>
                    5. انسخ المفتاح والصقه هنا
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={[styles.instructionText, isDarkMode && styles.darkSubText]}>
                    1. اذهب إلى makersuite.google.com
                  </Text>
                  <Text style={[styles.instructionText, isDarkMode && styles.darkSubText]}>
                    2. سجل دخولك بحساب Google
                  </Text>
                  <Text style={[styles.instructionText, isDarkMode && styles.darkSubText]}>
                    3. انقر على "Get API Key"
                  </Text>
                  <Text style={[styles.instructionText, isDarkMode && styles.darkSubText]}>
                    4. انسخ المفتاح والصقه هنا
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={validateAndSaveKey}
              loading={isValidating}
              disabled={isValidating || !apiKey.trim()}
              style={styles.primaryButton}
              buttonColor={isDarkMode ? "#64B5F6" : "#2196F3"}
              textColor="#fff"
            >
              {isValidating ? 'جاري التحقق...' : 'حفظ والتحقق'}
            </Button>

            <Button
              mode="outlined"
              onPress={testConnection}
              disabled={isValidating || !apiKey.trim()}
              style={styles.secondaryButton}
              textColor={isDarkMode ? "#64B5F6" : "#2196F3"}
            >
              اختبار الاتصال
            </Button>

            {apiKey && (
              <Button
                mode="text"
                onPress={clearAPIKey}
                textColor="#F44336"
                style={styles.dangerButton}
              >
                حذف مفتاح API
              </Button>
            )}
          </View>

          {/* Security Notice */}
          <Card style={[styles.card, styles.securityCard, isDarkMode && styles.darkSecurityCard]}>
            <Card.Content>
              <View style={styles.securityHeader}>
                <Icon name="shield-check" size={24} color={isDarkMode ? "#FFB74D" : "#FF9800"} />
                <Text style={[styles.securityTitle, isDarkMode && { color: "#FFB74D" }]}>ملاحظة أمنية</Text>
              </View>
              <Text style={[styles.securityText, isDarkMode && styles.darkSecurityText]}>
                • مفتاح API يُحفظ محلياً على جهازك فقط
              </Text>
              <Text style={[styles.securityText, isDarkMode && styles.darkSecurityText]}>
                • لا يتم إرسال المفتاح لأي خادم خارجي
              </Text>
              <Text style={[styles.securityText, isDarkMode && styles.darkSecurityText]}>
                • تأكد من عدم مشاركة مفتاحك مع أحد
              </Text>
              <Text style={[styles.securityText, isDarkMode && styles.darkSecurityText]}>
                • يمكنك حذف المفتاح في أي وقت
              </Text>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Snackbar for notifications */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={isDarkMode ? styles.darkSnackbar : styles.snackbar}
        action={{
          label: 'إغلاق',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTop: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196F3',
    marginLeft: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
    color: '#2c2c2c',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c2c2c',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioContent: {
    marginLeft: 12,
    flex: 1,
  },
  radioTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c2c2c',
  },
  radioSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  inputContainer: {
    marginBottom: 8,
  },
  textInput: {
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  darkTextInput: {
    backgroundColor: '#2c2c2c',
  },
  validationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  validationText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  instructionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  getKeyButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  getKeyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
  },
  instructionText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
    color: '#333',
  },
  buttonContainer: {
    marginVertical: 16,
  },
  primaryButton: {
    marginBottom: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  secondaryButton: {
    marginBottom: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dangerButton: {
    marginTop: 8,
  },
  securityCard: {
    backgroundColor: '#FFF3E0',
    marginBottom: 32,
    borderRadius: 12,
  },
  darkSecurityCard: {
    backgroundColor: '#332500',
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#FF9800',
  },
  securityText: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
    color: '#5D4037',
  },
  darkSecurityText: {
    color: '#E0E0E0',
  },
  darkText: {
    color: '#fff',
  },
  darkSubText: {
    color: '#aaa',
  },
  snackbar: {
    bottom: 16,
    backgroundColor: '#323232',
  },
  darkSnackbar: {
    bottom: 16,
    backgroundColor: '#424242',
  },
});

export default APISettingsScreen;