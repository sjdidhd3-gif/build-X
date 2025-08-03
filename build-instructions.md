# تعليمات بناء ملف APK لتطبيق Build X

## الطريقة 1: باستخدام EAS Build (موصى بها)

1. تأكد من تثبيت EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. قم بتسجيل الدخول إلى حساب Expo:
   ```bash
   eas login
   ```

3. قم ببناء ملف APK:
   ```bash
   eas build --platform android --profile preview
   ```

4. انتظر حتى اكتمال عملية البناء، ثم قم بتنزيل ملف APK من لوحة تحكم Expo.

## الطريقة 2: البناء المحلي

1. قم بتثبيت Java Development Kit (JDK) وAndroid SDK.

2. قم بإعداد متغيرات البيئة JAVA_HOME وANDROID_HOME.

3. قم بتنفيذ الأوامر التالية:
   ```bash
   npx expo prebuild --platform android
   cd android
   ./gradlew assembleRelease
   ```

4. ستجد ملف APK في المسار:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

## ملاحظات هامة

- تأكد من تحديث إصدار التطبيق في ملفي `app.json` و`package.json` قبل بناء إصدار جديد.
- تأكد من اختبار التطبيق جيدًا قبل نشره للمستخدمين.
- الإصدار الحالي هو v0.0.1 وهو قابل للتغيير.

## ميزات التطبيق

- واجهة مستخدم سهلة الاستخدام
- دعم الوضع المظلم
- تحويل الصوت إلى نص
- مشاركة الصور والملفات
- دعم اللغة العربية
- إمكانية التخصيص

## معلومات الاتصال

للمزيد من المعلومات أو الدعم، يرجى التواصل مع:
- المطور: Mustfa
- البريد الإلكتروني: [البريد الإلكتروني]