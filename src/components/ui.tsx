import React, { useContext, useRef } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { isNavigationRail } from '../navigation/tabLayout';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { GradientSurface as LinearGradient } from './GradientSurface';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { RootNavigation } from '../navigation/types';
import { colors, gradient, styles as s } from '../theme';
import { Icon, IconName } from './Icon';
import { useLayout } from '../hooks/useLayout';
import { useMotion } from '../hooks/useMotion';
import { AuroraGlow, ScreenMotion } from './Motion';
export function Button({
  title,
  onPress,
  outline = false,
  disabled = false,
  loading = false,
  icon,
  style,
}: {
  title: string;
  onPress: () => void;
  outline?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const { enabled } = useMotion();
  function press(toValue: number) {
    Animated.spring(scale, {
      toValue: enabled ? toValue : 1,
      speed: 28,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  }
  const content = (
    <>
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          <Text style={u.buttonText}>{title}</Text>
          {icon && <Icon name={icon} color="white" size={20} />}
        </>
      )}
    </>
  );
  return (
    <Animated.View
      style={[u.buttonContainer, style, { transform: [{ scale }] }]}
    >
      <Pressable
        onPressIn={() => press(0.97)}
        onPressOut={() => press(1)}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled: disabled || loading }}
        disabled={disabled || loading}
        onPress={onPress}
        style={({ pressed }) => [
          u.button,
          outline && u.outline,
          { opacity: disabled ? 0.4 : pressed ? 0.75 : 1 },
        ]}
      >
        {outline ? (
          <View style={u.buttonInner}>{content}</View>
        ) : (
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={u.buttonInner}
          >
            {content}
          </LinearGradient>
        )}
      </Pressable>
    </Animated.View>
  );
}
export function RoundButton({
  icon,
  onPress,
  label,
  disabled = false,
}: {
  icon: IconName;
  onPress: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={[u.round, disabled && { opacity: 0.35 }]}
    >
      <Icon name={icon} color={colors.text} />
    </Pressable>
  );
}
export function Page({
  children,
  narrow = false,
}: React.PropsWithChildren<{ narrow?: boolean }>) {
  const layout = useLayout();
  const tabBarHeight = useContext(BottomTabBarHeightContext);
  const { width, height } = useWindowDimensions();
  const rail = isNavigationRail(width, height);
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={s.page}>
      <LinearGradient
        colors={['#171531', '#0C1027', '#0A2538']}
        style={s.fill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <AuroraGlow />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom:
              tabBarHeight === undefined || rail ? 0 : tabBarHeight + 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          <ScreenMotion
            style={[
              s.content,
              { padding: layout.padding, maxWidth: narrow ? 640 : 1180 },
            ]}
          >
            {children}
          </ScreenMotion>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
export function Header({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle: string;
  eyebrow: string;
}) {
  const navigation = useNavigation<RootNavigation>();
  const layout = useLayout();
  return (
    <View style={s.gap}>
      <View style={[s.between, { marginBottom: 12 }]}>
        <View style={s.row}>
          <Text style={u.mark}>H</Text>
          <Text style={s.text}>
            HME <Text style={u.mark}>2026</Text>
          </Text>
        </View>
        <RoundButton
          icon="info"
          label="About the festival"
          onPress={() => navigation.navigate('About')}
        />
      </View>
      <Text style={s.eyebrow}>{eyebrow}</Text>
      <Text style={[s.title, { fontSize: layout.titleSize }]}>{title}</Text>
      <Text style={s.muted}>{subtitle}</Text>
    </View>
  );
}
export function Filters({
  values,
  selected,
  onSelect,
}: {
  values: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={u.filters}
    >
      {values.map(value => (
        <Pressable
          key={value}
          accessibilityRole="button"
          accessibilityState={{ selected: value === selected }}
          onPress={() => onSelect(value)}
        >
          <LinearGradient
            colors={
              value === selected
                ? ['#8750EF', '#354FCB']
                : [colors.card, colors.card]
            }
            style={[u.chip, value === selected && { borderColor: '#A08AFF' }]}
          >
            <Text
              style={{
                color: value === selected ? 'white' : colors.muted,
                fontSize: 12,
              }}
            >
              {value}
            </Text>
          </LinearGradient>
        </Pressable>
      ))}
    </ScrollView>
  );
}
export function Section({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  return (
    <View style={s.gap}>
      <Text style={s.heading}>{title}</Text>
      {typeof children === 'string' ? (
        <Text style={s.muted}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}
const u = StyleSheet.create({
  buttonContainer: { alignSelf: 'stretch', minWidth: 0, flexShrink: 0 },
  button: {
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    minHeight: 52,
    flexShrink: 0,
  },
  outline: {
    borderWidth: 1,
    borderColor: '#6553A1',
    backgroundColor: '#201D40',
  },
  buttonInner: {
    paddingHorizontal: 18,
    paddingVertical: 15,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    flexShrink: 1,
  },
  round: {
    width: 44,
    height: 44,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#17152F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: { color: colors.cyan, fontWeight: '900', letterSpacing: 1 },
  filters: { gap: 8, paddingVertical: 3 },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
