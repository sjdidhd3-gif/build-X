import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const WelcomeNote = () => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    checkIfShown();
  }, []);
  
  const checkIfShown = async () => {
    try {
      const hasShown = await AsyncStorage.getItem('welcome_note_shown');
      if (hasShown === 'true') {
        setVisible(false);
      }
    } catch (error) {
      console.error('خطأ في التحقق من عرض الملاحظة:', error);
    }
  };
  
  const handleClose = async () => {
    try {
      await AsyncStorage.setItem('welcome_note_shown', 'true');
      setVisible(false);
    } catch (error) {
      console.error('خطأ في حفظ حالة الملاحظة:', error);
    }
  };
  
  if (!visible) return null;
  
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.noteContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>مرحباً بكم في تطبيق Build X</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content}>
            <Text style={styles.message}>
              إلى جميع الزوار الذين أتوا إلى التطبيق من خلال دعوة المطور الرسمي، أن يدركوا أن هذا التطبيق هو في نسخة v 0.0.1 وكل الأشياء التي ترونها من الممكن تغييرها بالكامل.
            </Text>
            
            <Text style={styles.message}>
              يمكنك الآن استخدام ميزة تحويل الصوت إلى نص عن طريق الضغط على زر الميكروفون في شاشة المحادثة.
            </Text>
            
            <Text style={styles.message}>
              كما يمكنك استخدام ميزات متعددة مثل مشاركة الصور والملفات والمزيد من خلال زر الإضافة.
            </Text>
            
            <View style={styles.signature}>
              <Text style={styles.thanks}>شكراً لاستخدامك تطبيق Build X</Text>
              <Text style={styles.developer}>By: Mustfa</Text>
            </View>
          </ScrollView>
          
          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.buttonText}>فهمت</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noteContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: width * 0.9,
    maxHeight: height * 0.7,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    maxHeight: height * 0.4,
  },
  message: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'right',
  },
  signature: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  thanks: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  developer: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomeNote;