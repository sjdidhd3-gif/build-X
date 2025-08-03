#!/bin/bash

# Build X APK Builder Script (Cloud Version)
# This script prepares the app for building APK using EAS Build

echo "🚀 بدء إعداد تطبيق Build X للبناء السحابي..."

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📦 تثبيت EAS CLI..."
    npm install -g eas-cli
fi

# Install dependencies
echo "📦 تثبيت التبعيات..."
npm install

# Create a build profile for APK
echo "⚙️ إنشاء ملف تعريف البناء..."
cat > eas.json << EOL
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
EOL

# Generate a credentials.json file for offline builds
echo "🔑 إنشاء ملف بيانات الاعتماد..."
mkdir -p android/app/src/main/assets
touch android/app/src/main/assets/credentials.json

# Create a keystore directory
echo "🔐 إنشاء دليل keystore..."
mkdir -p android/keystores

echo "✅ تم الانتهاء من الإعداد!"
echo "📱 لبناء APK، قم بتنفيذ الأمر التالي:"
echo "    eas build --platform android --profile preview --local"
echo ""
echo "⚠️ ملاحظة: يتطلب البناء المحلي وجود JDK وAndroid SDK."
echo "   إذا كنت ترغب في البناء السحابي، قم بتنفيذ:"
echo "    eas build --platform android --profile preview"
echo "   (يتطلب حساب Expo)"