import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const FeaturesLabScreen = ({ navigation }) => {
  const [expandedFeature, setExpandedFeature] = useState(null);

  const toggleFeature = (featureId) => {
    if (expandedFeature === featureId) {
      setExpandedFeature(null);
    } else {
      setExpandedFeature(featureId);
    }
  };

  const handleFeaturePress = (feature) => {
    if (feature.isAvailable) {
      // Navigate to the feature or show its details
      if (feature.onPress) {
        feature.onPress();
      } else {
        Alert.alert(
          feature.title,
          'هذه الميزة قيد التطوير وستكون متاحة قريباً.',
          [{ text: 'حسناً', style: 'default' }]
        );
      }
    } else {
      // Show coming soon message
      Alert.alert(
        'قريباً',
        'هذه الميزة قيد التطوير وستكون متاحة قريباً.',
        [{ text: 'حسناً', style: 'default' }]
      );
    }
  };

  const features = [
    {
      id: 'web-builder',
      title: 'بناء مواقع الويب',
      description: 'إنشاء مواقع ويب تفاعلية بسهولة باستخدام الذكاء الاصطناعي.',
      icon: 'globe-outline',
      color: '#4CAF50',
      isAvailable: true,
      progress: 100,
      onPress: () => {
        Alert.alert(
          'بناء مواقع الويب',
          'يمكنك الآن بناء مواقع الويب باستخدام الذكاء الاصطناعي. ببساطة وصف ما تريده وسيقوم المساعد بإنشاء الكود اللازم.',
          [
            { 
              text: 'جرب الآن', 
              onPress: () => {
                navigation.navigate('Chat', { 
                  initialPrompt: 'أريد بناء موقع ويب لـ [وصف مشروعك]' 
                });
              } 
            },
            { text: 'إلغاء', style: 'cancel' }
          ]
        );
      }
    },
    {
      id: 'mobile-app',
      title: 'بناء تطبيقات الجوال',
      description: 'إنشاء تطبيقات للهواتف الذكية بمختلف المنصات.',
      icon: 'phone-portrait-outline',
      color: '#2196F3',
      isAvailable: true,
      progress: 100,
      onPress: () => {
        Alert.alert(
          'بناء تطبيقات الجوال',
          'يمكنك الآن بناء تطبيقات الجوال باستخدام الذكاء الاصطناعي. ببساطة وصف ما تريده وسيقوم المساعد بإنشاء الكود اللازم.',
          [
            { 
              text: 'جرب الآن', 
              onPress: () => {
                navigation.navigate('Chat', { 
                  initialPrompt: 'أريد بناء تطبيق جوال لـ [وصف مشروعك]' 
                });
              } 
            },
            { text: 'إلغاء', style: 'cancel' }
          ]
        );
      }
    },
    {
      id: 'desktop-app',
      title: 'بناء تطبيقات سطح المكتب',
      description: 'إنشاء تطبيقات لأنظمة ويندوز، ماك، ولينكس.',
      icon: 'desktop-outline',
      color: '#673AB7',
      isAvailable: true,
      progress: 100,
      onPress: () => {
        Alert.alert(
          'بناء تطبيقات سطح المكتب',
          'يمكنك الآن بناء تطبيقات سطح المكتب باستخدام الذكاء الاصطناعي. ببساطة وصف ما تريده وسيقوم المساعد بإنشاء الكود اللازم.',
          [
            { 
              text: 'جرب الآن', 
              onPress: () => {
                navigation.navigate('Chat', { 
                  initialPrompt: 'أريد بناء تطبيق سطح مكتب لـ [وصف مشروعك]' 
                });
              } 
            },
            { text: 'إلغاء', style: 'cancel' }
          ]
        );
      }
    },
    {
      id: 'api-builder',
      title: 'بناء واجهات برمجة API',
      description: 'إنشاء واجهات برمجة تطبيقات RESTful أو GraphQL.',
      icon: 'code-slash-outline',
      color: '#FF9800',
      isAvailable: true,
      progress: 100,
      onPress: () => {
        Alert.alert(
          'بناء واجهات برمجة API',
          'يمكنك الآن بناء واجهات برمجة API باستخدام الذكاء الاصطناعي. ببساطة وصف ما تريده وسيقوم المساعد بإنشاء الكود اللازم.',
          [
            { 
              text: 'جرب الآن', 
              onPress: () => {
                navigation.navigate('Chat', { 
                  initialPrompt: 'أريد بناء واجهة برمجة API لـ [وصف مشروعك]' 
                });
              } 
            },
            { text: 'إلغاء', style: 'cancel' }
          ]
        );
      }
    },
    {
      id: 'database-designer',
      title: 'تصميم قواعد البيانات',
      description: 'إنشاء وتصميم قواعد بيانات متطورة.',
      icon: 'server-outline',
      color: '#E91E63',
      isAvailable: true,
      progress: 100,
      onPress: () => {
        Alert.alert(
          'تصميم قواعد البيانات',
          'يمكنك الآن تصميم قواعد البيانات باستخدام الذكاء الاصطناعي. ببساطة وصف ما تريده وسيقوم المساعد بإنشاء الكود اللازم.',
          [
            { 
              text: 'جرب الآن', 
              onPress: () => {
                navigation.navigate('Chat', { 
                  initialPrompt: 'أريد تصميم قاعدة بيانات لـ [وصف مشروعك]' 
                });
              } 
            },
            { text: 'إلغاء', style: 'cancel' }
          ]
        );
      }
    },
    {
      id: 'ai-model-training',
      title: 'تدريب نماذج الذكاء الاصطناعي',
      description: 'إنشاء وتدريب نماذج ذكاء اصطناعي مخصصة.',
      icon: 'brain-outline',
      color: '#9C27B0',
      isAvailable: false,
      progress: 60,
    },
    {
      id: 'blockchain',
      title: 'تطوير تطبيقات البلوكتشين',
      description: 'إنشاء تطبيقات لامركزية وعقود ذكية.',
      icon: 'link-outline',
      color: '#00BCD4',
      isAvailable: false,
      progress: 40,
    },
    {
      id: 'game-development',
      title: 'تطوير الألعاب',
      description: 'إنشاء ألعاب للجوال وسطح المكتب والويب.',
      icon: 'game-controller-outline',
      color: '#8BC34A',
      isAvailable: false,
      progress: 30,
    },
    {
      id: 'ar-vr',
      title: 'الواقع المعزز والافتراضي',
      description: 'إنشاء تطبيقات الواقع المعزز والافتراضي.',
      icon: 'glasses-outline',
      color: '#FF5722',
      isAvailable: false,
      progress: 20,
    },
  ];

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
        <Text style={styles.headerTitle}>مختبر الميزات</Text>
        <View style={styles.headerRight} />
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.banner}>
          <Ionicons name="flask" size={40} color="#2196F3" />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>مختبر الميزات</Text>
            <Text style={styles.bannerSubtitle}>
              اكتشف وجرب أحدث الميزات قبل إطلاقها رسمياً
            </Text>
          </View>
        </View>
        
        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={[
                styles.featureCard,
                expandedFeature === feature.id && styles.expandedCard
              ]}
              onPress={() => toggleFeature(feature.id)}
              activeOpacity={0.8}
            >
              <View style={styles.featureHeader}>
                <View style={[styles.featureIconContainer, { backgroundColor: `${feature.color}20` }]}>
                  <Ionicons name={feature.icon} size={24} color={feature.color} />
                </View>
                <View style={styles.featureTitleContainer}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  {!feature.isAvailable && (
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonText}>قريباً</Text>
                    </View>
                  )}
                </View>
                <Ionicons
                  name={expandedFeature === feature.id ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#666"
                />
              </View>
              
              {expandedFeature === feature.id && (
                <View style={styles.featureDetails}>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                  
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: `${feature.progress}%`, backgroundColor: feature.color }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>{feature.progress}%</Text>
                  </View>
                  
                  <TouchableOpacity
                    style={[
                      styles.tryButton,
                      !feature.isAvailable && styles.disabledButton,
                      { backgroundColor: feature.isAvailable ? feature.color : '#ccc' }
                    ]}
                    onPress={() => handleFeaturePress(feature)}
                    disabled={!feature.isAvailable}
                  >
                    <Text style={styles.tryButtonText}>
                      {feature.isAvailable ? 'جرب الآن' : 'قريباً'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            يتم تحديث مختبر الميزات بشكل دوري بإضافة ميزات جديدة
          </Text>
        </View>
      </ScrollView>
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
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bannerContent: {
    flex: 1,
    marginLeft: 16,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  featuresGrid: {
    padding: 16,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  expandedCard: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  comingSoonBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  comingSoonText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  featureDetails: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    width: 40,
    textAlign: 'right',
  },
  tryButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  tryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default FeaturesLabScreen;