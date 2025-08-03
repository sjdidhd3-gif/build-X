import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const UpgradeScreen = ({ navigation, route }) => {
  const { userPoints, setUserPoints } = route.params || {};
  const [selectedPackage, setSelectedPackage] = useState(null);

  const packages = [
    {
      id: 1,
      name: 'حزمة المبتدئ',
      points: 100,
      price: '7,500 د.ع',
      color: '#4CAF50',
      icon: 'leaf-outline',
      features: ['100 نقطة', 'دعم أساسي', 'محادثات غير محدودة'],
    },
    {
      id: 2,
      name: 'حزمة المتقدم',
      points: 300,
      price: '18,000 د.ع',
      color: '#2196F3',
      icon: 'rocket-outline',
      features: ['300 نقطة', 'دعم متقدم', 'ميزات إضافية', 'أولوية في الردود'],
      popular: true,
    },
    {
      id: 3,
      name: 'حزمة الخبير',
      points: 500,
      price: '30,000 د.ع',
      color: '#FF9800',
      icon: 'diamond-outline',
      features: ['500 نقطة', 'دعم VIP', 'جميع الميزات', 'استشارات مخصصة'],
    },
    {
      id: 4,
      name: 'حزمة الاحتراف',
      points: 1000,
      price: '52,500 د.ع',
      color: '#9C27B0',
      icon: 'trophy-outline',
      features: ['1000 نقطة', 'دعم 24/7', 'ميزات حصرية', 'تدريب شخصي'],
    },
  ];

  const handlePurchase = (pkg) => {
    Alert.alert(
      'تأكيد الشراء',
      `هل تريد شراء ${pkg.name} مقابل ${pkg.price}؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'شراء',
          onPress: () => {
            // محاكاة عملية الشراء
            if (setUserPoints) {
              setUserPoints(prev => prev + pkg.points);
            }
            Alert.alert(
              'تم الشراء بنجاح!',
              `تم إضافة ${pkg.points} نقطة إلى رصيدك`,
              [{ text: 'موافق', onPress: () => navigation.goBack() }]
            );
          },
        },
      ]
    );
  };

  const renderPackage = (pkg) => (
    <TouchableOpacity
      key={pkg.id}
      style={[
        styles.packageCard,
        { borderColor: pkg.color },
        selectedPackage === pkg.id && { borderWidth: 2 },
        pkg.popular && styles.popularPackage,
      ]}
      onPress={() => setSelectedPackage(pkg.id)}
    >
      {pkg.popular && (
        <View style={[styles.popularBadge, { backgroundColor: pkg.color }]}>
          <Text style={styles.popularText}>الأكثر شعبية</Text>
        </View>
      )}
      
      <View style={[styles.packageHeader, { backgroundColor: pkg.color }]}>
        <Ionicons name={pkg.icon} size={32} color="#fff" />
        <Text style={styles.packageName}>{pkg.name}</Text>
        <Text style={styles.packagePoints}>{pkg.points} نقطة</Text>
      </View>
      
      <View style={styles.packageBody}>
        <Text style={styles.packagePrice}>{pkg.price}</Text>
        
        <View style={styles.featuresContainer}>
          {pkg.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color={pkg.color} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity
          style={[styles.purchaseButton, { backgroundColor: pkg.color }]}
          onPress={() => handlePurchase(pkg)}
        >
          <Ionicons name="cart" size={18} color="#fff" />
          <Text style={styles.purchaseText}>شراء الآن</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2c2c2c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ترقية الحساب</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Points */}
        <View style={styles.currentPointsCard}>
          <View style={styles.pointsInfo}>
            <Ionicons name="star" size={24} color="#FFD700" />
            <Text style={styles.currentPointsText}>رصيدك الحالي</Text>
            <Text style={styles.currentPointsValue}>{userPoints || 293} نقطة</Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>لماذا تحتاج للنقاط؟</Text>
          <View style={styles.infoRow}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#4CAF50" />
            <Text style={styles.infoText}>كل سؤال يكلف 5 نقاط</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="image" size={20} color="#2196F3" />
            <Text style={styles.infoText}>تحليل الصور يكلف 10 نقاط</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="code-slash" size={20} color="#FF9800" />
            <Text style={styles.infoText}>مراجعة الكود تكلف 15 نقطة</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="cash-outline" size={20} color="#9C27B0" />
            <Text style={styles.infoText}>الأسعار بالدينار العراقي (د.ع)</Text>
          </View>
        </View>

        {/* Packages */}
        <Text style={styles.sectionTitle}>اختر الحزمة المناسبة لك</Text>
        {packages.map(renderPackage)}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c2c2c',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  currentPointsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pointsInfo: {
    alignItems: 'center',
  },
  currentPointsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  currentPointsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c2c2c',
    marginTop: 4,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c2c2c',
    marginBottom: 12,
    textAlign: 'right',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    textAlign: 'right',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c2c2c',
    marginBottom: 16,
    textAlign: 'right',
  },
  packageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popularPackage: {
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  packageHeader: {
    padding: 20,
    alignItems: 'center',
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  packagePoints: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  packageBody: {
    padding: 20,
  },
  packagePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c2c2c',
    textAlign: 'center',
    marginBottom: 16,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    textAlign: 'right',
    flex: 1,
  },
  purchaseButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  purchaseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default UpgradeScreen;