import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { FestivalProvider } from './src/storage/FestivalProvider';
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0C1027" />
      <FestivalProvider>
        <AppNavigator />
      </FestivalProvider>
    </SafeAreaProvider>
  );
}
