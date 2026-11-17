import { StyleSheet } from 'react-native';
export const colors = {
  background: '#0C1027',
  card: '#161630',
  border: '#343057',
  text: '#F8F6FF',
  muted: '#A5A5BE',
  purple: '#8652FF',
  cyan: '#00D8F8',
  pink: '#EF3DBB',
  danger: '#EC416A',
};
export const gradient = ['#8A50FF', '#6047FF', '#00ADD2'];
export const styles = StyleSheet.create({
  fill: { flex: 1 },
  page: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: 20,
    paddingBottom: 32,
    gap: 22,
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: -0.8,
  },
  heading: { color: colors.text, fontSize: 20, fontWeight: '500' },
  text: { color: colors.text, fontSize: 15, lineHeight: 23 },
  muted: { color: colors.muted, fontSize: 14, lineHeight: 23 },
  small: { color: colors.muted, fontSize: 11, lineHeight: 18 },
  eyebrow: {
    color: '#A28AFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    overflow: 'hidden',
  },
  padded: { padding: 16, gap: 14 },
  link: { color: colors.cyan, fontSize: 13, fontWeight: '700' },
  center: { alignItems: 'center', justifyContent: 'center' },
  gap: { gap: 12 },
});
