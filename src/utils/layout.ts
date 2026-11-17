export function getLayout(width: number, height: number, fontScale = 1) {
  const compact = width < 380 || fontScale >= 1.4;
  const wide = width >= 600 && !compact;
  const padding = compact ? 12 : wide ? 28 : 20;
  return {
    width,
    height,
    compact,
    wide,
    padding,
    columns: wide ? (width >= 1050 ? 3 : 2) : 1,
    galleryColumns: compact ? 1 : wide ? (width >= 1050 ? 4 : 3) : 2,
    titleSize: compact ? 27 : wide ? 38 : 32,
    heroHeight: Math.max(180, Math.min(height * 0.44, wide ? 430 : 320)),
  };
}
