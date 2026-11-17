import React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GradientSurface as LinearGradient } from './GradientSurface';
import { useNavigation } from '@react-navigation/native';
import { RootNavigation } from '../navigation/types';
import { CatalogItem, DetailKind, Show } from '../types/models';
import { images } from '../data/images';
import { styles as s } from '../theme';
import { Button } from './ui';
import { Icon } from './Icon';
import { useLayout } from '../hooks/useLayout';
export function HeroCard({
  image,
  title,
  subtitle,
  badge,
  onPress,
}: {
  image: string;
  title: string;
  subtitle: string;
  badge: string;
  onPress: () => void;
}) {
  const layout = useLayout();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={s.card}
    >
      <ImageBackground
        source={images[image]}
        style={[c.hero, { height: layout.heroHeight }]}
      >
        <LinearGradient
          colors={['#0C102700', '#0C102733', '#0C1027EE']}
          style={c.overlay}
        >
          <Text style={c.badge}>{badge}</Text>
          <View style={s.gap}>
            <Text style={[s.title, { fontSize: 27 }]}>{title}</Text>
            <Text style={s.small}>{subtitle}</Text>
            <Text style={s.link}>View Details ›</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}
export function ShowCard({ show }: { show: Show }) {
  const navigation = useNavigation<RootNavigation>();
  const { compact } = useLayout();
  return (
    <View style={s.card}>
      <ImageBackground
        source={images[show.image]}
        style={[c.showImage, compact && { height: 160 }]}
      >
        <LinearGradient
          colors={['transparent', '#161630']}
          style={c.imageShade}
        >
          <Text style={c.badge}>{show.category}</Text>
          <Text style={[s.text, { fontWeight: '900' }]}>{show.time}</Text>
        </LinearGradient>
      </ImageBackground>
      <View style={s.padded}>
        <Text style={s.heading}>{show.title}</Text>
        <View style={s.row}>
          <Icon name="pin" size={15} />
          <Text style={[s.small, s.fill]}>
            {show.venue} · {show.duration} min
          </Text>
        </View>
        <Text style={s.muted}>{show.description}</Text>
        <Button
          outline
          title="View Details"
          icon="next"
          onPress={() =>
            navigation.navigate('Detail', { kind: 'show', id: show.id })
          }
        />
      </View>
    </View>
  );
}
export function SmallCard({
  item,
  kind,
  grid = false,
}: {
  item: CatalogItem;
  kind: DetailKind;
  grid?: boolean;
}) {
  const navigation = useNavigation<RootNavigation>();
  const { compact } = useLayout();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Explore ${item.title}`}
      onPress={() => navigation.navigate('Detail', { kind, id: item.id })}
      style={[s.card, grid || compact ? c.grid : c.horizontal]}
    >
      <Image
        source={images[item.image]}
        style={grid || compact ? c.gridImage : c.thumb}
      />
      <View style={[s.gap, grid || compact ? c.gridCopy : s.fill]}>
        <Text style={[s.eyebrow, { fontSize: 8, letterSpacing: 0.6 }]}>
          {item.category}
        </Text>
        <Text style={[s.text, { fontSize: 17 }]}>{item.title}</Text>
        <Text style={s.small} numberOfLines={grid ? 4 : 3}>
          {item.description}
        </Text>
        <Text style={s.link}>
          {kind === 'technology' ? 'Read More' : 'Explore'} ›
        </Text>
      </View>
    </Pressable>
  );
}
const c = StyleSheet.create({
  hero: { height: 310 },
  overlay: {
    flex: 1,
    padding: 18,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badge: {
    color: 'white',
    backgroundColor: '#0A0926CC',
    borderRadius: 9,
    overflow: 'hidden',
    padding: 8,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  showImage: { height: 190 },
  imageShade: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 12,
  },
  horizontal: {
    flexDirection: 'row',
    padding: 9,
    gap: 13,
    alignItems: 'center',
  },
  thumb: { width: 94, height: 132, borderRadius: 12 },
  grid: { width: '100%', padding: 8 },
  gridImage: { width: '100%', height: 150, borderRadius: 13 },
  gridCopy: { padding: 5, paddingTop: 12 },
});
