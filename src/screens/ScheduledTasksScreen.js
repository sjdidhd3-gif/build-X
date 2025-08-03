import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Switch,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const ScheduledTasksScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState(new Date());
  const [taskTime, setTaskTime] = useState(new Date());
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState('daily'); // daily, weekly, monthly
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('scheduledTasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        // Convert string dates back to Date objects
        const tasksWithDates = parsedTasks.map(task => ({
          ...task,
          date: new Date(task.date),
          time: new Date(task.time)
        }));
        setTasks(tasksWithDates);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحميل المهام');
    }
  };

  const saveTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem('scheduledTasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ المهام');
    }
  };

  const addTask = () => {
    if (!taskTitle.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال عنوان للمهمة');
      return;
    }

    const combinedDateTime = new Date(taskDate);
    combinedDateTime.setHours(
      taskTime.getHours(),
      taskTime.getMinutes(),
      0,
      0
    );

    const newTask = {
      id: editingTask ? editingTask.id : Date.now().toString(),
      title: taskTitle,
      description: taskDescription,
      date: taskDate,
      time: taskTime,
      isRecurring,
      recurringType,
      isCompleted: editingTask ? editingTask.isCompleted : false,
      createdAt: editingTask ? editingTask.createdAt : new Date(),
    };

    let updatedTasks;
    if (editingTask) {
      updatedTasks = tasks.map(task => 
        task.id === editingTask.id ? newTask : task
      );
    } else {
      updatedTasks = [...tasks, newTask];
    }

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    resetForm();
  };

  const editTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description || '');
    setTaskDate(new Date(task.date));
    setTaskTime(new Date(task.time));
    setIsRecurring(task.isRecurring || false);
    setRecurringType(task.recurringType || 'daily');
    setModalVisible(true);
  };

  const deleteTask = (id) => {
    Alert.alert(
      'تأكيد الحذف',
      'هل أنت متأكد من رغبتك في حذف هذه المهمة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'حذف', 
          style: 'destructive',
          onPress: () => {
            const updatedTasks = tasks.filter(task => task.id !== id);
            setTasks(updatedTasks);
            saveTasks(updatedTasks);
          }
        }
      ]
    );
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const resetForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskDate(new Date());
    setTaskTime(new Date());
    setIsRecurring(false);
    setRecurringType('daily');
    setModalVisible(false);
    setEditingTask(null);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTaskDate(selectedDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTaskTime(selectedTime);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRecurringText = (task) => {
    if (!task.isRecurring) return '';
    
    switch (task.recurringType) {
      case 'daily':
        return 'يومياً';
      case 'weekly':
        return 'أسبوعياً';
      case 'monthly':
        return 'شهرياً';
      default:
        return '';
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.taskItem, item.isCompleted && styles.completedTask]}>
      <TouchableOpacity 
        style={styles.taskCheckbox}
        onPress={() => toggleTaskCompletion(item.id)}
      >
        <Ionicons 
          name={item.isCompleted ? "checkmark-circle" : "ellipse-outline"} 
          size={24} 
          color={item.isCompleted ? "#4CAF50" : "#666"} 
        />
      </TouchableOpacity>
      
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, item.isCompleted && styles.completedText]}>
          {item.title}
        </Text>
        
        {item.description ? (
          <Text style={[styles.taskDescription, item.isCompleted && styles.completedText]}>
            {item.description}
          </Text>
        ) : null}
        
        <View style={styles.taskMeta}>
          <View style={styles.taskMetaItem}>
            <Ionicons name="calendar-outline" size={14} color="#666" />
            <Text style={styles.taskMetaText}>{formatDate(new Date(item.date))}</Text>
          </View>
          
          <View style={styles.taskMetaItem}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.taskMetaText}>{formatTime(new Date(item.time))}</Text>
          </View>
          
          {item.isRecurring && (
            <View style={styles.taskMetaItem}>
              <Ionicons name="repeat-outline" size={14} color="#666" />
              <Text style={styles.taskMetaText}>{getRecurringText(item)}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.taskActions}>
        <TouchableOpacity 
          style={styles.taskAction}
          onPress={() => editTask(item)}
        >
          <Ionicons name="create-outline" size={20} color="#2196F3" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.taskAction}
          onPress={() => deleteTask(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
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
        <Text style={styles.headerTitle}>المهام المجدولة</Text>
        <View style={styles.headerRight} />
      </View>
      
      {/* Task List */}
      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.taskList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>لا توجد مهام مجدولة</Text>
          <Text style={styles.emptyStateSubtext}>
            اضغط على زر "+" لإضافة مهمة جديدة
          </Text>
        </View>
      )}
      
      {/* Add Task Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
      
      {/* Add/Edit Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingTask ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>العنوان</Text>
              <TextInput
                style={styles.input}
                value={taskTitle}
                onChangeText={setTaskTitle}
                placeholder="أدخل عنوان المهمة"
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>الوصف (اختياري)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={taskDescription}
                onChangeText={setTaskDescription}
                placeholder="أدخل وصف المهمة"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>التاريخ</Text>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimeText}>
                  {formatDate(taskDate)}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={taskDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                />
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>الوقت</Text>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimeText}>
                  {formatTime(taskTime)}
                </Text>
                <Ionicons name="time-outline" size={20} color="#666" />
              </TouchableOpacity>
              
              {showTimePicker && (
                <DateTimePicker
                  value={taskTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onTimeChange}
                />
              )}
            </View>
            
            <View style={styles.formGroup}>
              <View style={styles.switchContainer}>
                <Text style={styles.label}>تكرار المهمة</Text>
                <Switch
                  value={isRecurring}
                  onValueChange={setIsRecurring}
                  trackColor={{ false: '#e0e0e0', true: '#4CAF50' }}
                  thumbColor={isRecurring ? '#fff' : '#f4f3f4'}
                />
              </View>
            </View>
            
            {isRecurring && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>نوع التكرار</Text>
                <View style={styles.recurringOptions}>
                  <TouchableOpacity
                    style={[
                      styles.recurringOption,
                      recurringType === 'daily' && styles.selectedRecurringOption
                    ]}
                    onPress={() => setRecurringType('daily')}
                  >
                    <Text style={[
                      styles.recurringOptionText,
                      recurringType === 'daily' && styles.selectedRecurringOptionText
                    ]}>
                      يومي
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.recurringOption,
                      recurringType === 'weekly' && styles.selectedRecurringOption
                    ]}
                    onPress={() => setRecurringType('weekly')}
                  >
                    <Text style={[
                      styles.recurringOptionText,
                      recurringType === 'weekly' && styles.selectedRecurringOptionText
                    ]}>
                      أسبوعي
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.recurringOption,
                      recurringType === 'monthly' && styles.selectedRecurringOption
                    ]}
                    onPress={() => setRecurringType('monthly')}
                  >
                    <Text style={[
                      styles.recurringOptionText,
                      recurringType === 'monthly' && styles.selectedRecurringOptionText
                    ]}>
                      شهري
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={addTask}
            >
              <Text style={styles.saveButtonText}>
                {editingTask ? 'تحديث المهمة' : 'إضافة المهمة'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  taskList: {
    padding: 16,
  },
  taskItem: {
    flexDirection: 'row',
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
  completedTask: {
    backgroundColor: '#f9f9f9',
    borderColor: '#e0e0e0',
  },
  taskCheckbox: {
    marginRight: 12,
    alignSelf: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  taskMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  taskMetaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  taskActions: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  taskAction: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  textArea: {
    minHeight: 80,
  },
  dateTimeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recurringOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recurringOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedRecurringOption: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  recurringOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedRecurringOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScheduledTasksScreen;