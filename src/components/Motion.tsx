import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { GradientSurface as LinearGradient } from './GradientSurface';
import { useIsFocused } from '@react-navigation/native';
import { useMotion } from '../hooks/useMotion';
export function ScreenMotion({
  children,
  style,
  identity,
}: React.PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  identity?: string | number;
}>) {
  const focused = useIsFocused();
  const { enabled } = useMotion();
  const progress = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    progress.stopAnimation();
    if (!enabled || !focused) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 480,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [focused, enabled, identity, progress]);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
export function AuroraGlow() {
  const focused = useIsFocused();
  const { enabled } = useMotion();
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!enabled || !focused) {
      progress.setValue(0);
      return;
    }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 6500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
          isInteraction: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 6500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
          isInteraction: false,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [enabled, focused, progress]);
  return (
    <Animated.View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.glow,
        {
          opacity: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.18, 0.42],
          }),
          transform: [
            {
              translateX: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [-45, 45],
              }),
            },
            { rotate: '-25deg' },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={['transparent', '#8A50FF55', '#00D8F855', 'transparent']}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    width: '140%',
    height: '90%',
    top: '-10%',
    left: '-20%',
  },
});
