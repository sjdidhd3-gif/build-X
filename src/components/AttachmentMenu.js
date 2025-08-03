import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const AttachmentMenu = ({ onSelect, onClose }) => {
  const attachmentOptions = [
    {
      id: 'video',
      icon: 'videocam',
      title: 'فيديو',
      color: '#888888',
    },
    {
      id: 'image',
      icon: 'image',
      title: 'صورة',
      color: '#888888',
    },
    {
      id: 'spreadsheet',
      icon: 'grid',
      title: 'جدول بيانات',
      color: '#888888',
    },
    {
      id: 'slides',
      icon: 'albums',
      title: 'Slides',
      color: '#888888',
    },
  ];

  const quickActions = [
    {
      id: 'camera',
      icon: 'camera',
      title: 'الكاميرا',
      color: '#607D8B',
    },
    {
      id: 'document',
      icon: 'document-attach',
      title: 'ملف',
      color: '#607D8B',
    },
    {
      id: 'voice',
      icon: 'mic',
      title: 'تسجيل صوتي',
      color: '#607D8B',
    },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        
        <View style={styles.menuContainer}>
          {/* Attachment Options - Simple Row Layout */}
          <View style={styles.attachmentRow}>
            {attachmentOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.attachmentOption}
                onPress={() => onSelect(option.id)}
              >
                <View style={styles.attachmentIconContainer}>
                  <Ionicons name={option.icon} size={24} color="#666" />
                </View>
                <Text style={styles.attachmentText}>{option.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Input Placeholder */}
          <View style={styles.inputPlaceholder}>
            <Text style={styles.inputPlaceholderText}>
              أعط Manus مهمة للعمل عليها...
            </Text>
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <TouchableOpacity 
              style={styles.micButton}
              onPress={() => onSelect('voice')}
            >
              <Ionicons name="mic" size={24} color="#333" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.adaptiveButton}
              onPress={() => onSelect('adaptive')}
            >
              <Ionicons name="sparkles-outline" size={24} color="#333" />
              <Text style={styles.adaptiveText}>تكيفي</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={onClose}
            >
              <Ionicons name="add" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  backdrop: {
    flex: 1,
  },
  menuContainer: {
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  attachmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  attachmentOption: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  attachmentIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  attachmentText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  inputPlaceholder: {
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputPlaceholderText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'right',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  micButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  adaptiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  adaptiveText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
  },
  addButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});

export default AttachmentMenu;