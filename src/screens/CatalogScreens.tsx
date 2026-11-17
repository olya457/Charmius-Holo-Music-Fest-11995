import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { shows, exhibits, technologies } from '../data';
import { RootNavigation } from '../navigation/types';
import { Page, Header, Filters, Button } from '../components/ui';
import { HeroCard, ShowCard, SmallCard } from '../components/Cards';
import { styles as s } from '../theme';
import { Grid } from '../components/Responsive';
import { useLayout } from '../hooks/useLayout';
export function ShowsScreen() {
  const [filter, setFilter] = useState('All Shows');
  const navigation = useNavigation<RootNavigation>();
  const filtered = shows.filter(
    item => filter === 'All Shows' || item.category === filter,
  );
  return (
    <Page>
      <Header
        title="Holographic Concerts"
        subtitle="Extraordinary live performances powered by digital artists and immersive technology."
        eyebrow="ORGANIZED BY CHARMIUS HOLO MUSIC FEST"
      />
      <Button title="Six-Month Programme · Nov – Apr" icon="booking" onPress={() => navigation.navigate('Schedule')} />
      <HeroCard
        image="festival-entrance"
        title="Neon Pulse Live"
        subtitle="19:00 · Main Hologram Arena"
        badge="FEATURED · FESTIVAL HIGHLIGHT"
        onPress={() =>
          navigation.navigate('Detail', { kind: 'show', id: shows[0].id })
        }
      />
      <View style={s.between}>
        <Text style={s.heading}>Explore shows</Text>
        <Text style={s.small}>{filtered.length} events</Text>
      </View>
      <Filters
        values={['All Shows', ...new Set(shows.map(item => item.category))]}
        selected={filter}
        onSelect={setFilter}
      />
      <Grid>
        {filtered.map(show => (
          <ShowCard key={show.id} show={show} />
        ))}
      </Grid>
    </Page>
  );
}
export function GalleryScreen() {
  const [filter, setFilter] = useState('Digital Performers');
  const layout = useLayout();
  const filtered = exhibits.filter(item => item.category === filter);

  return (
    <Page>
      <Header
        title="Hologram Gallery"
        subtitle="Discover digital performers, luminous sculptures and immersive art created for the future."
        eyebrow="DIGITAL ART COLLECTION"
      />
      <Filters
        values={[...new Set(exhibits.map(item => item.category))]}
        selected={filter}
        onSelect={setFilter}
      />
      <View style={s.between}>
        <Text style={s.heading}>Featured exhibits</Text>
        <Text style={s.small}>{filtered.length} works</Text>
      </View>
      <Grid columns={layout.galleryColumns}>
        {filtered.map(item => (
          <SmallCard key={item.id} item={item} kind="exhibit" grid />
        ))}
      </Grid>
    </Page>
  );
}
export function TechScreen() {
  const navigation = useNavigation<RootNavigation>();
  return (
    <Page>
      <Header
        title="Behind the Holograms"
        subtitle="Explore the technologies transforming music into immersive digital experiences."
        eyebrow="DISCOVERY LAB"
      />
      <HeroCard
        image="holographic-concert"
        title="Is it really a hologram?"
        subtitle="Discover the optical systems behind the illusion."
        badge="FEATURED EXPLAINER"
        onPress={() =>
          navigation.navigate('Detail', {
            kind: 'technology',
            id: technologies[0].id,
          })
        }
      />
      <View style={s.between}>
        <Text style={s.heading}>Explore technology</Text>
        <Text style={s.small}>{technologies.length} articles</Text>
      </View>
      <Button
        title="Explore Articles & Videos"
        icon="next"
        onPress={() => navigation.navigate('Learning')}
      />
      <Grid>
        {technologies.map(item => (
          <SmallCard key={item.id} item={item} kind="technology" />
        ))}
      </Grid>
    </Page>
  );
}
