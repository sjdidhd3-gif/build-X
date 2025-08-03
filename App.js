import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { I18nManager } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainScreen from './src/screens/MainScreen';
import ChatScreen from './src/screens/ChatScreenNew';
import APISettingsScreen from './src/screens/APISettingsScreen';
import UpgradeScreen from './src/screens/UpgradeScreen';
import ScheduledTasksScreen from './src/screens/ScheduledTasksScreen';
import KnowledgeScreen from './src/screens/KnowledgeScreen';
import FeaturesLabScreen from './src/screens/FeaturesLabScreen';
import CloudBrowserScreen from './src/screens/CloudBrowserScreen';
import LanguageScreen from './src/screens/LanguageScreen';

// Enable RTL for Arabic
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const Stack = createStackNavigator();

const theme = {
  colors: {
    primary: '#2c2c2c',
    accent: '#f0f0f0',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#000000',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="APISettings" component={APISettingsScreen} />
          <Stack.Screen name="Upgrade" component={UpgradeScreen} />
          <Stack.Screen name="ScheduledTasks" component={ScheduledTasksScreen} />
          <Stack.Screen name="Knowledge" component={KnowledgeScreen} />
          <Stack.Screen name="FeaturesLab" component={FeaturesLabScreen} />
          <Stack.Screen name="CloudBrowser" component={CloudBrowserScreen} />
          <Stack.Screen name="Language" component={LanguageScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
