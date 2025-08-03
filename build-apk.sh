#!/bin/bash

# Build X APK Builder Script
# This script builds the APK for the Build X app

echo "🚀 بدء بناء APK لتطبيق Build X..."

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📦 تثبيت EAS CLI..."
    npm install -g eas-cli
fi

# Install dependencies
echo "📦 تثبيت التبعيات..."
npm install

# Build APK using Expo's prebuild and standard React Native build tools
echo "🔨 بناء APK للأندرويد..."
npx expo prebuild --platform android
cd android
./gradlew assembleRelease

echo "✅ تم الانتهاء من بناء APK!"
echo "📱 يمكنك العثور على APK في المسار: android/app/build/outputs/apk/release/app-release.apk"