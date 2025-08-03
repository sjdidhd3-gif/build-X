import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageScreen = ({ navigation, route }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('ar');
  const [languages, setLanguages] = useState([
    { id: 'ar', name: 'العربية', nativeName: 'العربية', isRTL: true, isAvailable: true },
    { id: 'en', name: 'English', nativeName: 'English', isRTL: false, isAvailable: true },
    { id: 'fr', name: 'French', nativeName: 'Français', isRTL: false, isAvailable: false },
    { id: 'es', name: 'Spanish', nativeName: 'Español', isRTL: false, isAvailable: false },
    { id: 'de', name: 'German', nativeName: 'Deutsch', isRTL: false, isAvailable: false },
    { id: 'zh', name: 'Chinese', nativeName: '中文', isRTL: false, isAvailable: false },
    { id: 'ja', name: 'Japanese', nativeName: '日本語', isRTL: false, isAvailable: false },
    { id: 'ru', name: 'Russian', nativeName: 'Русский', isRTL: false, isAvailable: false },
    { id: 'tr', name: 'Turkish', nativeName: 'Türkçe', isRTL: false, isAvailable: false },
    { id: 'ur', name: 'Urdu', nativeName: 'اردو', isRTL: true, isAvailable: false },
  ]);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        setSelectedLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const handleLanguageSelect = async (languageId) => {
    if (languageId === selectedLanguage) return;
    
    const language = languages.find(lang => lang.id === languageId);
    
    if (!language.isAvailable) {
      Alert.alert(
        'لغة غير متاحة',
        'هذه اللغة غير متاحة حالياً. سيتم إضافتها في تحديثات قادمة.',
        [{ text: 'حسناً', style: 'default' }]
      );
      return;
    }
    
    try {
      await AsyncStorage.setItem('language', languageId);
      setSelectedLanguage(languageId);
      
      // Show confirmation message
      Alert.alert(
        'تم تغيير اللغة',
        'تم تغيير لغة التطبيق بنجاح. يرجى إعادة تشغيل التطبيق لتطبيق التغييرات.',
        [
          { 
            text: 'حسناً', 
            onPress: () => {
              // Return to previous screen with the new language
              if (route.params?.onLanguageChange) {
                route.params.onLanguageChange(languageId);
              }
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error saving language:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ اللغة');
    }
  };

  const renderLanguageItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        selectedLanguage === item.id && styles.selectedLanguageItem
      ]}
      onPress={() => handleLanguageSelect(item.id)}
      disabled={selectedLanguage === item.id}
    >
      <View style={styles.languageInfo}>
        <Text style={[
          styles.languageName,
          selectedLanguage === item.id && styles.selectedLanguageText
        ]}>
          {item.nativeName}
        </Text>
        <Text style={styles.languageNameEnglish}>
          {item.name !== item.nativeName ? item.name : ''}
        </Text>
      </View>
      
      {!item.isAvailable && (
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>قريباً</Text>
        </View>
      )}
      
      {selectedLanguage === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-forward" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>اللغة</Text>
        <View style={styles.headerRight} />
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>
          اختر لغة التطبيق المفضلة لديك
        </Text>
        
        <FlatList
          data={languages}
          renderItem={renderLanguageItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.languageList}
        />
        
        <Text style={styles.note}>
          ملاحظة: قد تحتاج إلى إعادة تشغيل التطبيق لتطبيق التغييرات بشكل كامل.
        </Text>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  languageList: {
    paddingBottom: 20,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedLanguageItem: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
    borderWidth: 1,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedLanguageText: {
    color: '#2196F3',
  },
  languageNameEnglish: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  comingSoonBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  comingSoonText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  note: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
});

export default LanguageScreen;