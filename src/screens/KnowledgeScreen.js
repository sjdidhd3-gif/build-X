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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const KnowledgeScreen = ({ navigation }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (sectionId) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
    }
  };

  const knowledgeSections = [
    {
      id: 'intro',
      title: 'ما هو تطبيق Build X؟',
      icon: 'information-circle-outline',
      content: `تطبيق Build X هو منصة متكاملة تتيح لك بناء تطبيقات وحلول برمجية متنوعة باستخدام الذكاء الاصطناعي، دون الحاجة إلى خبرة برمجية سابقة.

يمكنك من خلال التطبيق:
• إنشاء تطبيقات بأكثر من 50 لغة برمجية
• بناء مواقع ويب تفاعلية
• تطوير واجهات مستخدم احترافية
• إنشاء تطبيقات للهواتف الذكية
• تحويل أفكارك إلى منتجات حقيقية

كل ذلك من خلال واجهة سهلة الاستخدام ومساعد ذكي يوجهك خطوة بخطوة.`
    },
    {
      id: 'features',
      title: 'الميزات الرئيسية',
      icon: 'star-outline',
      content: `• المساعد الذكي: محادثة تفاعلية مع الذكاء الاصطناعي لمساعدتك في بناء مشاريعك.

• المهام المجدولة: جدولة المهام وتتبعها بسهولة مع إمكانية التكرار اليومي أو الأسبوعي أو الشهري.

• مختبر الميزات: تجربة ميزات جديدة قبل إطلاقها رسمياً.

• متصفح السحابة: الوصول إلى ملفاتك ومشاريعك المخزنة على السحابة.

• ضوابط البيانات: التحكم الكامل في بياناتك وخصوصيتك.

• تعدد اللغات: دعم اللغة العربية والإنجليزية وإمكانية إضافة لغات أخرى.

• نظام النقاط: اكسب نقاط عند استخدام التطبيق ومشاركته مع الأصدقاء.`
    },
    {
      id: 'getting-started',
      title: 'البدء باستخدام التطبيق',
      icon: 'play-outline',
      content: `للبدء باستخدام تطبيق Build X، اتبع الخطوات التالية:

1. قم بإنشاء حساب جديد أو تسجيل الدخول إذا كان لديك حساب بالفعل.

2. أضف مفتاح API الخاص بك من خلال الإعدادات (يمكنك الحصول على مفتاح مجاني من خلال الموقع الرسمي).

3. ابدأ محادثة جديدة مع المساعد الذكي واشرح له المشروع الذي ترغب في بنائه.

4. استخدم الأدوات المتاحة مثل رفع الصور والملفات لتوضيح أفكارك.

5. احفظ المشروع في متصفح السحابة للرجوع إليه لاحقاً.

6. جدول المهام المتعلقة بمشروعك باستخدام ميزة المهام المجدولة.`
    },
    {
      id: 'ai-assistant',
      title: 'استخدام المساعد الذكي',
      icon: 'chatbubble-ellipses-outline',
      content: `المساعد الذكي هو القلب النابض لتطبيق Build X، ويمكنه مساعدتك في:

• كتابة وتصحيح الأكواد البرمجية بأكثر من 50 لغة.
• تصميم واجهات المستخدم وتحويل الأفكار إلى تصاميم.
• إنشاء قواعد البيانات وهيكلة المشاريع.
• حل المشكلات البرمجية وتقديم اقتراحات لتحسين الأداء.
• شرح المفاهيم البرمجية المعقدة بطريقة مبسطة.

للحصول على أفضل النتائج:
- كن محدداً في طلباتك
- قدم أمثلة واضحة
- استخدم ميزة رفع الصور لتوضيح أفكارك
- قسم المشاريع الكبيرة إلى مهام أصغر`
    },
    {
      id: 'cloud-browser',
      title: 'استخدام متصفح السحابة',
      icon: 'cloud-outline',
      content: `متصفح السحابة يتيح لك:

• تخزين مشاريعك وملفاتك بأمان على السحابة.
• الوصول إلى مشاريعك من أي جهاز.
• مشاركة الملفات مع الآخرين بسهولة.
• تنظيم المشاريع في مجلدات.
• البحث السريع عن الملفات.
• استعادة الإصدارات السابقة من المشاريع.

لاستخدام متصفح السحابة:
1. انتقل إلى قسم "متصفح السحابة" من القائمة الجانبية.
2. اضغط على زر "+" لإنشاء مجلد جديد أو رفع ملف.
3. اضغط مطولاً على أي ملف للوصول إلى خيارات إضافية مثل التحميل، المشاركة، أو الحذف.`
    },
    {
      id: 'points-system',
      title: 'نظام النقاط والمكافآت',
      icon: 'gift-outline',
      content: `يمكنك كسب النقاط في تطبيق Build X من خلال:

• الاستخدام اليومي للتطبيق (10 نقاط يومياً).
• إكمال المهام المجدولة (5 نقاط لكل مهمة).
• مشاركة التطبيق مع الأصدقاء (250 نقطة لكل صديق يقوم بالتسجيل).
• المشاركة في استطلاعات الرأي (50 نقطة).
• الإبلاغ عن الأخطاء (100 نقطة).

يمكنك استبدال النقاط بـ:
• ترقية حسابك إلى الخطة المميزة.
• الحصول على ميزات إضافية.
• زيادة حد الاستخدام اليومي.
• قوالب جاهزة للمشاريع.
• دعم فني متميز.`
    },
    {
      id: 'troubleshooting',
      title: 'حل المشكلات الشائعة',
      icon: 'help-circle-outline',
      content: `إذا واجهت أي مشكلة في استخدام التطبيق، جرب الحلول التالية:

• مشكلة عدم الاتصال بالمساعد الذكي:
  - تأكد من إضافة مفتاح API صحيح في الإعدادات.
  - تحقق من اتصالك بالإنترنت.
  - قم بإعادة تشغيل التطبيق.

• بطء في استجابة التطبيق:
  - قم بمسح ذاكرة التخزين المؤقت من الإعدادات.
  - تأكد من وجود مساحة كافية على جهازك.
  - قم بتحديث التطبيق إلى أحدث إصدار.

• مشكلة في حفظ المشاريع:
  - تأكد من تسجيل الدخول إلى حسابك.
  - تحقق من اتصالك بالإنترنت.
  - جرب حفظ المشروع بمسمى مختلف.

للحصول على مساعدة إضافية، يمكنك التواصل مع فريق الدعم الفني من خلال قسم "الإعدادات" > "الدعم الفني".`
    }
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
        <Text style={styles.headerTitle}>المعرفة</Text>
        <View style={styles.headerRight} />
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.banner}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.bannerLogo}
            resizeMode="contain"
          />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>مرحباً بك في Build X</Text>
            <Text style={styles.bannerSubtitle}>
              دليلك الشامل لاستخدام التطبيق والاستفادة من جميع ميزاته
            </Text>
          </View>
        </View>
        
        {/* Knowledge Sections */}
        {knowledgeSections.map((section) => (
          <View key={section.id} style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(section.id)}
            >
              <View style={styles.sectionHeaderLeft}>
                <Ionicons name={section.icon} size={24} color="#2196F3" />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <Ionicons
                name={expandedSection === section.id ? "chevron-up" : "chevron-down"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
            
            {expandedSection === section.id && (
              <View style={styles.sectionContent}>
                <Text style={styles.sectionText}>{section.content}</Text>
              </View>
            )}
          </View>
        ))}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            إصدار التطبيق: 0.0.1
          </Text>
          <TouchableOpacity
            style={styles.supportButton}
            onPress={() => navigation.navigate('Support')}
          >
            <Text style={styles.supportButtonText}>تواصل مع الدعم الفني</Text>
          </TouchableOpacity>
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
  bannerLogo: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  bannerContent: {
    flex: 1,
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  sectionContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
    textAlign: 'right',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  supportButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  supportButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default KnowledgeScreen;