import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { useLayout } from '../hooks/useLayout';
import { useMotion } from '../hooks/useMotion';
export function Sheet({
  visible,
  onClose,
  children,
  light = false,
  scrollable = true,
}: React.PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
  light?: boolean;
  scrollable?: boolean;
}>) {
  const { wide, padding } = useLayout();
  const { reduced } = useMotion();
  return (
    <Modal
      visible={visible}
      transparent
      animationType={reduced ? 'none' : 'slide'}
      onRequestClose={onClose}
    >
      <View
        style={[a.overlay, { padding }, wide && { justifyContent: 'center' }]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close dialog"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <SafeAreaView
          edges={['bottom']}
          style={[
            a.sheet,
            { width: '100%', maxWidth: 560, alignSelf: 'center' },
            light && { backgroundColor: '#F5F2FC' },
          ]}
          accessibilityViewIsModal
        >
          {scrollable ? (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={a.body}
            >
              {children}
            </ScrollView>
          ) : (
            children
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
}
const a = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#030513CC',
    padding: 16,
  },
  body: { gap: 18 },
  sheet: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    gap: 18,
    maxHeight: '85%',
  },
});
