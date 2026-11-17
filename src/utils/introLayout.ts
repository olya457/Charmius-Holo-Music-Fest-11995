import { getLayout } from './layout';
export function getIntroLayout(
  width: number,
  height: number,
  insets: { top: number; bottom: number; left: number; right: number },
  fontScale = 1,
) {
  const sidePadding = Math.max(insets.left, insets.right);
  const availableWidth = Math.max(1, width - sidePadding * 2);
  const availableHeight = Math.max(1, height - insets.top - insets.bottom);
  return {
    ...getLayout(availableWidth, availableHeight, fontScale),
    sidePadding,
    logoSize: Math.max(
      1,
      Math.min(availableWidth - 40, Math.max(80, availableHeight - 260), 370),
    ),
  };
}
