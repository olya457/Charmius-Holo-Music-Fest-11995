import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useLayout } from '../hooks/useLayout';
export function Grid({
  children,
  columns,
}: React.PropsWithChildren<{ columns?: number }>) {
  const layout = useLayout();
  const count = columns ?? layout.columns;
  return (
    <View style={styles.grid}>
      {React.Children.toArray(children).map((child, index) => (
        <View
          key={React.isValidElement(child) ? child.key ?? index : index}
          style={{ width: `${(100 - (count - 1) * 2) / count}%` }}
        >
          {child}
        </View>
      ))}
    </View>
  );
}
export function Columns({ children }: React.PropsWithChildren) {
  const { wide } = useLayout();
  return (
    <View style={[styles.columns, wide && styles.wide]}>
      {React.Children.toArray(children).map((child, index) => (
        <View key={index} style={[styles.column, wide && styles.half]}>
          {child}
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: '2%', rowGap: 18 },
  columns: { gap: 24 },
  wide: { flexDirection: 'row', alignItems: 'flex-start', gap: 32 },
  column: { gap: 22, minWidth: 0 },
  half: { flex: 1 },
});
