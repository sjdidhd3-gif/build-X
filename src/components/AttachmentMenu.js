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
      id: 'camera',
      icon: 'camera',
      title: 'الكاميرا',
      color: '#4CAF50',
    },
    {
      id: 'image',
      icon: 'image',
      title: 'صورة',
      color: '#2196F3',
    },
    {
      id: 'document',
      icon: 'document-attach',
      title: 'ملف',
      color: '#FF9800',
    },
    {
      id: 'video',
      icon: 'videocam',
      title: 'فيديو',
      color: '#E91E63',
    },
    {
      id: 'voice',
      icon: 'mic',
      title: 'تسجيل صوتي',
      color: '#FF5722',
    },
  ];

  const quickActions = [
    {
      id: 'slides',
      icon: 'albums',
      title: 'Slides',
      color: '#9C27B0',
    },
    {
      id: 'agent',
      icon: 'person',
      title: 'Agent',
      color: '#607D8B',
    },
    {
      id: 'chat',
      icon: 'chatbubbles',
      title: 'Chat',
      color: '#795548',
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
        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>إعطاء أمر</Text>
          <View style={styles.quickActions}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionButton}
                onPress={() => onSelect(action.id)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon} size={20} color="#fff" />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Attachment Options */}
        <View style={styles.attachmentContainer}>
          <View style={styles.attachmentGrid}>
            {attachmentOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.attachmentOption}
                onPress={() => onSelect(option.id)}
              >
                <View style={[styles.attachmentIcon, { backgroundColor: option.color }]}>
                  <Ionicons name={option.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.attachmentText}>{option.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity 
            style={styles.voiceButton}
            onPress={() => onSelect('voice')}
          >
            <Ionicons name="mic" size={24} color="#2c2c2c" />
          </TouchableOpacity>
          
          <View style={styles.inputActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onSelect('enhance')}
            >
              <Ionicons name="sparkles" size={20} color="#2c2c2c" />
              <Text style={styles.actionText}>تحسين</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onSelect('translate')}
            >
              <Ionicons name="language" size={20} color="#2c2c2c" />
              <Text style={styles.actionText}>ترجمة</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  quickActionsContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c2c2c',
    marginBottom: 16,
    textAlign: 'right',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActionButton: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  attachmentContainer: {
    padding: 20,
  },
  attachmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  attachmentOption: {
    alignItems: 'center',
    width: '22%',
    marginBottom: 20,
  },
  attachmentIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  attachmentText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  voiceButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  inputActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    marginLeft: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#2c2c2c',
    marginLeft: 6,
    fontWeight: '600',
  },
});

export default AttachmentMenu;