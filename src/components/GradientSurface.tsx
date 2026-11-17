import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import NativeLinearGradient from 'react-native-linear-gradient';
type Props = Omit<
  React.ComponentProps<typeof NativeLinearGradient>,
  'children' | 'style'
> & {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};
export function GradientSurface({ children, style, ...gradientProps }: Props) {
  return (
    <View style={[styles.surface, style]}>
      <NativeLinearGradient
        {...gradientProps}
        pointerEvents="none"
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ surface: { overflow: 'hidden' } });
