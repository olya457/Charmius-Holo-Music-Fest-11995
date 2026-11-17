import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, IconName } from '../components/Icon';
import { colors } from '../theme';
import { isNavigationRail } from './tabLayout';
const icons: Record<string, IconName> = {
  Shows: 'shows',
  Gallery: 'gallery',
  Map: 'map',
  Tech: 'tech',
  Booking: 'booking',
};
export function renderFloatingTabBar(props: BottomTabBarProps) {
  return <FloatingTabBar {...props} />;
}
export function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const rail = isNavigationRail(width, height);
  const side = Math.max(
    16,
    insets.left + 12,
    insets.right + 12,
    (width - 520) / 2,
  );
  const railHeight = Math.min(282, height - insets.top - insets.bottom - 32);
  return (
    <View
      style={[
        styles.bar,
        rail
          ? {
              left: insets.left + 20,
              top:
                insets.top +
                (height - insets.top - insets.bottom - railHeight) / 2,
              width: 64,
              height: railHeight,
            }
          : { left: side, right: side, bottom: 20, height: 64 },
      ]}
    >
      <ScrollView
        horizontal={!rail}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, rail && styles.rail]}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const options = descriptors[route.key].options;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityLabel={
                options.tabBarAccessibilityLabel ?? route.name
              }
              accessibilityState={{ selected: focused }}
              testID={`tab-${route.name}`}
              style={({ pressed }) => [
                styles.item,
                !rail && styles.bottomItem,
                { opacity: pressed ? 0.65 : 1 },
              ]}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              }}
              onLongPress={() =>
                navigation.emit({ type: 'tabLongPress', target: route.key })
              }
            >
              <View style={[styles.highlight, focused && styles.active]}>
                <Icon
                  name={icons[route.name]}
                  color={focused ? colors.cyan : '#9692B0'}
                  size={24}
                />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    zIndex: 100,
    backgroundColor: '#111329',
    borderWidth: 1,
    borderColor: '#494261',
    borderRadius: 25,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 5,
  },
  rail: { flexDirection: 'column' },
  item: {
    minHeight: 48,
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomItem: { flex: 1 },
  highlight: {
    width: 46,
    height: 46,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  active: { backgroundColor: '#17354B', borderColor: '#32768A' },
});
