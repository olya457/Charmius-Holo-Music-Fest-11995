import React from 'react';
import { useWindowDimensions } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootParams, TabParams } from './types';
import { SplashScreen, OnboardingScreen } from '../screens/IntroScreens';
import {
  ShowsScreen,
  GalleryScreen,
  TechScreen,
} from '../screens/CatalogScreens';
import { MapScreen } from '../screens/MapScreen';
import { BookingScreen } from '../screens/BookingScreen';
import { TicketScreen } from '../screens/TicketScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { renderFloatingTabBar } from './FloatingTabBar';
import { isNavigationRail } from './tabLayout';
import { colors } from '../theme';
import { useMotion } from '../hooks/useMotion';
import { LearningScreen } from '../screens/LearningScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';
const Stack = createNativeStackNavigator<RootParams>();
const Tab = createBottomTabNavigator<TabParams>();
function MainTabs() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const rail = isNavigationRail(width, height);
  const { reduced } = useMotion();
  return (
    <Tab.Navigator
      tabBar={renderFloatingTabBar}
      safeAreaInsets={{ bottom: 0, top: 0, left: 0, right: 0 }}
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: reduced ? 'none' : 'fade',
        tabBarPosition: 'bottom',
        tabBarShowLabel: false,
        tabBarAccessibilityLabel: route.name,
        tabBarStyle: { height: 64 },
        sceneStyle: { paddingLeft: rail ? insets.left + 96 : 0 },
      })}
    >
      <Tab.Screen name="Shows" component={ShowsScreen} />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Tech" component={TechScreen} />
      <Tab.Screen name="Booking" component={BookingScreen} />
    </Tab.Navigator>
  );
}
export function AppNavigator() {
  const { reduced } = useMotion();
  return (
    <NavigationContainer
      theme={{
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          primary: colors.cyan,
          border: colors.border,
        },
      }}
    >
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: reduced ? 'none' : 'fade_from_bottom',
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Ticket" component={TicketScreen} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} />
        <Stack.Screen name="Learning" component={LearningScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
