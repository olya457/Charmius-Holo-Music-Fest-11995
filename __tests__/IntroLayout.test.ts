import { getIntroLayout } from '../src/utils/introLayout';
test('Duo asymmetric system area keeps both intro screens centered', () => {
  for (const [left, right] of [
    [0, 84],
    [84, 0],
  ]) {
    const layout = getIntroLayout(466, 678, { left, right, top: 0, bottom: 0 });
    expect(layout.sidePadding + layout.width / 2).toBe(233);
    expect(layout.logoSize + 40).toBeLessThanOrEqual(layout.width);
    expect(layout.sidePadding).toBeGreaterThanOrEqual(Math.max(left, right));
  }
});
test('intro sizing remains usable on small and wide windows', () => {
  for (const [width, height] of [
    [320, 568],
    [402, 874],
    [1194, 800],
  ]) {
    const layout = getIntroLayout(width, height, {
      left: 0,
      right: 0,
      top: 44,
      bottom: 34,
    });
    expect(layout.logoSize).toBeGreaterThan(0);
    expect(layout.logoSize + 40).toBeLessThanOrEqual(width);
    expect(layout.wide).toBe(width >= 600);
  }
});
