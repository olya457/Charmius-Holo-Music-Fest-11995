import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getLayout } from '../utils/layout';
export function useLayout() {
  const { width, height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  return getLayout(
    Math.max(1, width - insets.left - insets.right),
    Math.max(1, height - insets.top - insets.bottom),
    fontScale,
  );
}
