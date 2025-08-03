import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Linking,
  Share,
  Switch,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AIService from '../services/AIService';

const { width, height } = Dimensions.get('window');

const SideMenu = ({ userType, email, name, userPoints, onClose, navigation, setUserPoints }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cacheSize, setCacheSize] = useState('98 MB');
  const [language, setLanguage] = useState('العربية');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);

  useEffect(() => {
    loadSettings();
    loadTasks();
  }, []);

  const loadSettings = async () => {
    try {
      const darkMode = await AsyncStorage.getItem('darkMode');
      const savedLanguage = await AsyncStorage.getItem('language');
      
      if (darkMode !== null) {
        setIsDarkMode(darkMode === 'true');
      }
      
      if (savedLanguage !== null) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('خطأ في تحميل الإعدادات:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('scheduledTasks');
      if (savedTasks !== null) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error('خطأ في تحميل المهام:', error);
    }
  };

  const saveTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem('scheduledTasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('خطأ في حفظ المهام:', error);
    }
  };

  const addTask = () => {
    if (newTask.trim()) {
      const updatedTasks = [...tasks, { 
        id: Date.now().toString(), 
        title: newTask, 
        completed: false,
        date: new Date().toISOString()
      }];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      setNewTask('');
    }
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const toggleDarkMode = async (value) => {
    setIsDarkMode(value);
    await AsyncStorage.setItem('darkMode', value.toString());
  };

  const changeLanguage = async (newLanguage) => {
    setLanguage(newLanguage);
    await AsyncStorage.setItem('language', newLanguage);
    setShowLanguageModal(false);
  };

  const clearCache = async () => {
    try {
      // Clear conversation history and other cached data
      await AsyncStorage.removeItem('conversationHistory');
      // Add other cache items to clear as needed
      
      setCacheSize('0 MB');
      Alert.alert('تم مسح الذاكرة', 'تم مسح ذاكرة التخزين المؤقت بنجاح');
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء مسح الذاكرة');
    }
    onClose();
  };

  const shareApp = async () => {
    try {
      const result = await Share.share({
        message: 'جرب تطبيق Build X الرائع! يمكنك بناء تطبيقات بأكثر من 50 لغة ومواقع ويب وأكثر. استخدم رابط الدعوة الخاص بي للحصول على 250 نقطة مجانية: https://buildx.app/invite/' + (name || email || 'guest'),
      });
      
      if (result.action === Share.sharedAction) {
        // Add points for sharing
        if (setUserPoints) {
          setUserPoints(prevPoints => prevPoints + 250);
          await AsyncStorage.setItem('userPoints', (userPoints + 250).toString());
        }
      }
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء المشاركة');
    }
    onClose();
  };

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'تسجيل الخروج', 
          onPress: () => {
            onClose();
            navigation.navigate('Login');
          }
        }
      ]
    );
  };

  const handleUpgrade = () => {
    onClose();
    navigation.navigate('Upgrade', { userPoints, setUserPoints });
  };

  const menuItems = [
    {
      icon: 'star',
      title: 'رصيد النقاط',
      subtitle: `${userPoints} نقطة`,
      onPress: handleUpgrade,
      rightComponent: () => (
        <TouchableOpacity 
          style={styles.upgradeButtonSmall} 
          onPress={handleUpgrade}
        >
          <Text style={styles.upgradeTextSmall}>ترقية</Text>
        </TouchableOpacity>
      )
    },
    {
      icon: 'link-outline',
      title: 'شارك مع صديق',
      subtitle: 'اربح 250 نقطة',
      onPress: shareApp
    },
    {
      icon: 'calendar-outline',
      title: 'المهام المجدولة',
      onPress: () => setShowTasksModal(true)
    },
    {
      icon: 'book-outline',
      title: 'معرفة',
      onPress: () => setShowAboutModal(true)
    },
    {
      icon: 'flask-outline',
      title: 'مختبر الميزات',
      onPress: () => setShowFeaturesModal(true)
    },
    {
      icon: 'shield-outline',
      title: 'ضوابط البيانات',
      onPress: () => {
        Alert.alert(
          'ضوابط البيانات',
          'يمكنك التحكم في كيفية استخدام بياناتك وتخزينها.',
          [
            { text: 'حذف جميع البيانات', onPress: clearCache, style: 'destructive' },
            { text: 'إلغاء', style: 'cancel' }
          ]
        );
      }
    },
    {
      icon: 'desktop-outline',
      title: 'متصفح السحابية',
      onPress: () => {
        Alert.alert(
          'متصفح السحابية',
          'يمكنك الوصول إلى ملفاتك المخزنة على السحابة من هنا.',
          [
            { text: 'فتح المتصفح', onPress: () => {
              onClose();
              // Navigate to cloud browser when implemented
              Alert.alert('متصفح السحابية', 'سيتم إضافة هذه الميزة قريباً');
            }},
            { text: 'إلغاء', style: 'cancel' }
          ]
        );
      }
    },
    {
      icon: 'globe-outline',
      title: 'اللغة',
      subtitle: language,
      onPress: () => setShowLanguageModal(true)
    },
    {
      icon: 'person-outline',
      title: 'الحساب',
      onPress: () => {
        if (userType === 'guest') {
          Alert.alert(
            'الحساب',
            'أنت مسجل كضيف. هل ترغب في إنشاء حساب؟',
            [
              { text: 'تسجيل الدخول', onPress: () => {
                onClose();
                navigation.navigate('Login');
              }},
              { text: 'إنشاء حساب', onPress: () => {
                onClose();
                navigation.navigate('Register');
              }},
              { text: 'إلغاء', style: 'cancel' }
            ]
          );
        } else {
          Alert.alert(
            'الحساب',
            'إدارة إعدادات حسابك',
            [
              { text: 'تعديل الملف الشخصي', onPress: () => {
                onClose();
                // Navigate to profile edit screen when implemented
                Alert.alert('تعديل الملف الشخصي', 'سيتم إضافة هذه الميزة قريباً');
              }},
              { text: 'تغيير كلمة المرور', onPress: () => {
                onClose();
                // Navigate to password change screen when implemented
                Alert.alert('تغيير كلمة المرور', 'سيتم إضافة هذه الميزة قريباً');
              }},
              { text: 'إلغاء', style: 'cancel' }
            ]
          );
        }
      }
    },
    {
      icon: 'settings-outline',
      title: 'إعدادات API',
      onPress: () => {
        onClose();
        navigation.navigate('APISettings');
      }
    },
    {
      icon: 'moon-outline',
      title: 'المظهر',
      subtitle: isDarkMode ? 'داكن' : 'فاتح',
      onPress: () => setShowThemeModal(true)
    },
    {
      icon: 'trash-outline',
      title: 'مسح ذاكرة التخزين المؤقت',
      subtitle: cacheSize,
      onPress: clearCache
    },
  ];

  const additionalItems = [
    {
      icon: 'heart-outline',
      title: 'قيم هذا التطبيق',
      onPress: () => {
        Alert.alert('التقييم', 'شكراً لك! سيتم توجيهك لمتجر التطبيقات');
        onClose();
      }
    },
    {
      icon: 'help-circle-outline',
      title: 'الحصول على مساعدة',
      onPress: () => {
        Alert.alert('المساعدة', 'سيتم إضافة مركز المساعدة قريباً');
        onClose();
      }
    },
  ];

  // مكونات النوافذ المنبثقة
  const renderLanguageModal = () => (
    <Modal
      visible={showLanguageModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowLanguageModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>اختر اللغة</Text>
            <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.languageOption, language === 'العربية' && styles.selectedLanguage]} 
            onPress={() => changeLanguage('العربية')}
          >
            <Text style={styles.languageText}>العربية</Text>
            {language === 'العربية' && <Ionicons name="checkmark" size={20} color="#2c2c2c" />}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.languageOption, language === 'English' && styles.selectedLanguage]} 
            onPress={() => changeLanguage('English')}
          >
            <Text style={styles.languageText}>English</Text>
            {language === 'English' && <Ionicons name="checkmark" size={20} color="#2c2c2c" />}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderThemeModal = () => (
    <Modal
      visible={showThemeModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowThemeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>اختر المظهر</Text>
            <TouchableOpacity onPress={() => setShowThemeModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.themeOption}>
            <View style={styles.themeOptionContent}>
              <Ionicons name={isDarkMode ? "moon" : "sunny"} size={24} color="#666" />
              <Text style={styles.themeText}>{isDarkMode ? 'الوضع الداكن' : 'الوضع الفاتح'}</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: "#ccc", true: "#2c2c2c" }}
              thumbColor={isDarkMode ? "#fff" : "#fff"}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.themeButton}
            onPress={() => {
              toggleDarkMode(!isDarkMode);
              setShowThemeModal(false);
            }}
          >
            <Text style={styles.themeButtonText}>تطبيق</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderTasksModal = () => (
    <Modal
      visible={showTasksModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowTasksModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, styles.tasksModalContent]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>المهام المجدولة</Text>
            <TouchableOpacity onPress={() => setShowTasksModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.taskInputContainer}>
            <TextInput
              style={styles.taskInput}
              placeholder="أضف مهمة جديدة..."
              value={newTask}
              onChangeText={setNewTask}
            />
            <TouchableOpacity style={styles.addTaskButton} onPress={addTask}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.tasksList}>
            {tasks.length === 0 ? (
              <View style={styles.emptyTasksContainer}>
                <Ionicons name="calendar-outline" size={48} color="#ccc" />
                <Text style={styles.emptyTasksText}>لا توجد مهام مجدولة</Text>
                <Text style={styles.emptyTasksSubtext}>أضف مهامك للبقاء منظماً</Text>
              </View>
            ) : (
              tasks.map(task => (
                <View key={task.id} style={styles.taskItem}>
                  <TouchableOpacity 
                    style={styles.taskCheckbox}
                    onPress={() => toggleTaskCompletion(task.id)}
                  >
                    <Ionicons 
                      name={task.completed ? "checkmark-circle" : "ellipse-outline"} 
                      size={24} 
                      color={task.completed ? "#4CAF50" : "#666"} 
                    />
                  </TouchableOpacity>
                  
                  <View style={styles.taskContent}>
                    <Text style={[
                      styles.taskTitle,
                      task.completed && styles.taskCompleted
                    ]}>
                      {task.title}
                    </Text>
                    <Text style={styles.taskDate}>
                      {new Date(task.date).toLocaleDateString('ar-EG')}
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.deleteTaskButton}
                    onPress={() => deleteTask(task.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderAboutModal = () => (
    <Modal
      visible={showAboutModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowAboutModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, styles.aboutModalContent]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>عن التطبيق</Text>
            <TouchableOpacity onPress={() => setShowAboutModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.aboutContent}>
            <View style={styles.aboutLogoContainer}>
              <Text style={styles.aboutLogo}>Build X</Text>
              <Text style={styles.aboutVersion}>الإصدار 1.0.0</Text>
            </View>
            
            <Text style={styles.aboutDescription}>
              Build X هو تطبيق متكامل يتيح لك بناء تطبيقات وبرامج متنوعة بأكثر من 50 لغة برمجة مختلفة.
            </Text>
            
            <View style={styles.aboutSection}>
              <Text style={styles.aboutSectionTitle}>المميزات الرئيسية:</Text>
              <View style={styles.aboutFeature}>
                <Ionicons name="code-slash" size={20} color="#2c2c2c" />
                <Text style={styles.aboutFeatureText}>دعم لأكثر من 50 لغة برمجة</Text>
              </View>
              <View style={styles.aboutFeature}>
                <Ionicons name="desktop" size={20} color="#2c2c2c" />
                <Text style={styles.aboutFeatureText}>بناء تطبيقات ويب ومواقع إلكترونية</Text>
              </View>
              <View style={styles.aboutFeature}>
                <Ionicons name="phone-portrait" size={20} color="#2c2c2c" />
                <Text style={styles.aboutFeatureText}>إنشاء تطبيقات الهاتف المحمول</Text>
              </View>
              <View style={styles.aboutFeature}>
                <Ionicons name="cloud-upload" size={20} color="#2c2c2c" />
                <Text style={styles.aboutFeatureText}>نشر التطبيقات على السحابة</Text>
              </View>
              <View style={styles.aboutFeature}>
                <Ionicons name="people" size={20} color="#2c2c2c" />
                <Text style={styles.aboutFeatureText}>العمل التعاوني مع فريق</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.aboutButton}
              onPress={() => {
                setShowAboutModal(false);
                Linking.openURL('https://buildx.app');
              }}
            >
              <Text style={styles.aboutButtonText}>زيارة الموقع الرسمي</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderFeaturesModal = () => (
    <Modal
      visible={showFeaturesModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowFeaturesModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, styles.featuresModalContent]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>مختبر الميزات</Text>
            <TouchableOpacity onPress={() => setShowFeaturesModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.featuresContent}>
            <Text style={styles.featuresDescription}>
              اكتشف الميزات الجديدة والتجريبية في Build X. يمكنك تجربة هذه الميزات قبل إطلاقها رسمياً.
            </Text>
            
            <View style={styles.featureCard}>
              <View style={styles.featureCardHeader}>
                <Ionicons name="code-slash" size={24} color="#2c2c2c" />
                <Text style={styles.featureCardTitle}>بناء تطبيقات بلغات متعددة</Text>
                <View style={styles.featureBadge}>
                  <Text style={styles.featureBadgeText}>جديد</Text>
                </View>
              </View>
              <Text style={styles.featureCardDescription}>
                قم ببناء تطبيقات باستخدام أكثر من 50 لغة برمجة مختلفة، بما في ذلك JavaScript، Python، Java، وغيرها.
              </Text>
              <TouchableOpacity style={styles.featureCardButton}>
                <Text style={styles.featureCardButtonText}>تجربة</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureCardHeader}>
                <Ionicons name="globe" size={24} color="#2c2c2c" />
                <Text style={styles.featureCardTitle}>بناء مواقع الويب</Text>
                <View style={styles.featureBadge}>
                  <Text style={styles.featureBadgeText}>تجريبي</Text>
                </View>
              </View>
              <Text style={styles.featureCardDescription}>
                قم بإنشاء مواقع ويب تفاعلية باستخدام HTML، CSS، وJavaScript، مع دعم لأطر العمل الحديثة مثل React وVue.
              </Text>
              <TouchableOpacity style={styles.featureCardButton}>
                <Text style={styles.featureCardButtonText}>تجربة</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureCardHeader}>
                <Ionicons name="phone-portrait" size={24} color="#2c2c2c" />
                <Text style={styles.featureCardTitle}>تطبيقات الهاتف المحمول</Text>
                <View style={[styles.featureBadge, styles.comingSoonBadge]}>
                  <Text style={styles.featureBadgeText}>قريباً</Text>
                </View>
              </View>
              <Text style={styles.featureCardDescription}>
                قم بإنشاء تطبيقات للهواتف الذكية لنظامي Android وiOS باستخدام React Native أو Flutter.
              </Text>
              <TouchableOpacity style={[styles.featureCardButton, styles.disabledButton]}>
                <Text style={[styles.featureCardButtonText, styles.disabledButtonText]}>غير متاح حالياً</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* User Info */}
          <View style={styles.userSection}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userType === 'guest' ? 'ض' : (name ? name.charAt(0) : email?.charAt(0) || 'U')}
                </Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {userType === 'guest' ? 'ضيف' : (name || email)}
                </Text>
                {userType !== 'guest' && email && (
                  <Text style={styles.userEmail}>{email}</Text>
                )}
                <View style={styles.planBadge}>
                  <Text style={styles.planText}>Free</Text>
                </View>
              </View>
            </View>

            {/* Points Display */}
            <View style={styles.pointsSection}>
              <View style={styles.pointsRow}>
                <Text style={styles.pointsLabel}>رصيد</Text>
                <View style={styles.pointsValue}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.pointsNumber}>{userPoints}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Build X</Text>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <View style={styles.menuItemContent}>
                  <Ionicons name={item.icon} size={20} color={item.icon === 'star' ? "#FFD700" : "#666"} />
                  <View style={styles.menuItemText}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    {item.subtitle && (
                      <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                    )}
                  </View>
                </View>
                {item.rightComponent ? item.rightComponent() : (
                  <Ionicons name="chevron-back" size={16} color="#ccc" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Additional Items */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>معلومات</Text>
            {additionalItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <View style={styles.menuItemContent}>
                  <Ionicons name={item.icon} size={20} color="#666" />
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-back" size={16} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          {userType !== 'guest' && (
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#ff4444" />
              <Text style={styles.logoutText}>تسجيل الخروج</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Render Modals */}
      {renderLanguageModal()}
      {renderThemeModal()}
      {renderTasksModal()}
      {renderAboutModal()}
      {renderFeaturesModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    width: width * 0.85,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  userSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c2c2c',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  planBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  planText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  pointsSection: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 16,
    color: '#2c2c2c',
    fontWeight: '600',
  },
  pointsValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c2c2c',
    marginLeft: 4,
  },
  menuSection: {
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#999',
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: 'right',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    marginLeft: 16,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    color: '#2c2c2c',
    textAlign: 'right',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    textAlign: 'right',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  logoutText: {
    fontSize: 16,
    color: '#ff4444',
    marginLeft: 12,
    fontWeight: '600',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: width * 0.85,
    maxHeight: height * 0.8,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c2c2c',
  },
  
  // Language Modal Styles
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedLanguage: {
    backgroundColor: '#f0f0f0',
  },
  languageText: {
    fontSize: 16,
    color: '#2c2c2c',
  },
  
  // Theme Modal Styles
  themeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
  },
  themeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeText: {
    fontSize: 16,
    color: '#2c2c2c',
    marginLeft: 12,
  },
  themeButton: {
    backgroundColor: '#2c2c2c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  themeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Tasks Modal Styles
  tasksModalContent: {
    padding: 0,
    paddingTop: 20,
  },
  taskInputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  taskInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
    textAlign: 'right',
  },
  addTaskButton: {
    backgroundColor: '#2c2c2c',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tasksList: {
    maxHeight: height * 0.5,
  },
  emptyTasksContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTasksText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c2c2c',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyTasksSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  taskCheckbox: {
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    color: '#2c2c2c',
    marginBottom: 4,
    textAlign: 'right',
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskDate: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  deleteTaskButton: {
    padding: 8,
  },
  
  // About Modal Styles
  aboutModalContent: {
    padding: 0,
    paddingTop: 20,
  },
  aboutContent: {
    paddingHorizontal: 20,
  },
  aboutLogoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  aboutLogo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c2c2c',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 14,
    color: '#666',
  },
  aboutDescription: {
    fontSize: 16,
    color: '#2c2c2c',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  aboutSection: {
    marginBottom: 24,
  },
  aboutSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c2c2c',
    marginBottom: 16,
    textAlign: 'right',
  },
  aboutFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aboutFeatureText: {
    fontSize: 16,
    color: '#2c2c2c',
    marginLeft: 12,
    textAlign: 'right',
  },
  aboutButton: {
    backgroundColor: '#2c2c2c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  aboutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Features Modal Styles
  featuresModalContent: {
    padding: 0,
    paddingTop: 20,
  },
  featuresContent: {
    paddingHorizontal: 20,
  },
  featuresDescription: {
    fontSize: 16,
    color: '#2c2c2c',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  featureCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c2c2c',
    flex: 1,
    marginLeft: 12,
    textAlign: 'right',
  },
  featureBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonBadge: {
    backgroundColor: '#FF9800',
  },
  featureBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featureCardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'right',
  },
  featureCardButton: {
    backgroundColor: '#2c2c2c',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  featureCardButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  disabledButtonText: {
    color: '#666',
  },
  upgradeButtonSmall: {
    backgroundColor: '#2c2c2c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeTextSmall: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default SideMenu;