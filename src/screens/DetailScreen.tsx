import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientSurface as LinearGradient } from '../components/GradientSurface';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootParams } from '../navigation/types';
import {
  exhibits,
  findLocation,
  locations,
  shows,
  technologies,
} from '../data';
import { images } from '../data/images';
import { Show, Technology } from '../types/models';
import { Button, RoundButton, Section } from '../components/ui';
import { ShowCard, SmallCard } from '../components/Cards';
import { Icon } from '../components/Icon';
import { colors, styles as s } from '../theme';
import { useLayout } from '../hooks/useLayout';
import { ScreenMotion, AuroraGlow } from '../components/Motion';
import { Columns } from '../components/Responsive';
import { resources } from '../data/resources';
import { ResourceCard } from '../components/ResourceCard';
export function DetailScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootParams, 'Detail'>) {
  const { kind, id } = route.params;
  const layout = useLayout();
  const item = (
    kind === 'show'
      ? shows
      : kind === 'exhibit'
      ? exhibits
      : kind === 'location'
      ? locations
      : technologies
  ).find(value => value.id === id);
  if (!item) {
    return (
      <SafeAreaView style={[s.page, s.content]}>
        <Text style={s.title}>Item unavailable</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }
  const show = kind === 'show' ? (item as Show) : null;
  const technology = kind === 'technology' ? (item as Technology) : null;
  const location =
    kind === 'location'
      ? findLocation(item.title)
      : findLocation(
          show?.venue ?? item.meta.Location ?? 'Technology Discovery Center',
        );
  const relatedShows = shows.filter(
    value =>
      value.venue === item.title || value.title === item.meta['Related Show'],
  );
  function openMap() {
    navigation.popTo('Main', {
      screen: 'Map',
      params: { locationId: location?.id },
    });
  }
  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={s.page}>
      <AuroraGlow />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScreenMotion
          identity={id}
          style={[s.content, { padding: layout.padding }]}
        >
          <Columns>
            <View style={s.gap}>
              <ImageBackground
                source={images[item.image]}
                style={[
                  d.hero,
                  {
                    height: layout.heroHeight,
                    borderRadius: 20,
                    overflow: 'hidden',
                  },
                ]}
              >
                <LinearGradient
                  colors={['#0C102722', '#0C102722', colors.background]}
                  style={d.shade}
                >
                  <RoundButton
                    icon="back"
                    label="Go back"
                    onPress={() => navigation.goBack()}
                  />
                  <Text style={d.badge}>{item.category}</Text>
                </LinearGradient>
              </ImageBackground>
            </View>
            <View style={s.gap}>
              <Text style={[s.title, { fontSize: layout.titleSize }]}>
                {item.title}
              </Text>
              {!show && <Text style={s.muted}>{item.description}</Text>}
              {show && (
                <View style={d.facts}>
                  {[
                    { label: 'TIME', value: show.time, icon: 'clock' as const },
                    {
                      label: 'DURATION',
                      value: `${show.duration} min`,
                      icon: 'tech' as const,
                    },
                    { label: 'VENUE', value: show.venue, icon: 'pin' as const },
                  ].map(fact => (
                    <View key={fact.label} style={[s.card, d.fact]}>
                      <Icon name={fact.icon} color="#A28AFF" />
                      <View style={s.fill}>
                        <Text style={s.small}>{fact.label}</Text>
                        <Text
                          style={[s.text, { fontSize: 12, fontWeight: '700' }]}
                        >
                          {fact.value}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
              <Section
                title={
                  show
                    ? 'About This Show'
                    : technology
                    ? 'Inside the Technology'
                    : kind === 'location'
                    ? 'About This Location'
                    : 'About the Exhibit'
                }
              >
                {item.body}
              </Section>
              {show && (
                <>
                  <Section title="Visual Experience">
                    {item.meta['Experience Highlights']}
                  </Section>
                  <Section title="The Performer">
                    {item.meta['Featured Performers'] ??
                      item.meta['Featured Performer'] ??
                      item.meta['Featured Experience']}
                  </Section>
                </>
              )}
              {kind === 'exhibit' && (
                <>
                  <Section title="Visual Characteristics">
                    {item.meta['Visual Features']}
                  </Section>
                  <Section title="Technology">{item.meta.Technology}</Section>
                </>
              )}
              {technology && (
                <>
                  <View
                    style={[s.card, s.padded, { backgroundColor: '#201E44' }]}
                  >
                    <Text style={s.eyebrow}>HOW IT WORKS</Text>
                    <Text style={s.heading}>From signal to spectacle</Text>
                    <Text style={s.muted}>{technology.how}</Text>
                  </View>
                  <Section title="Interesting Facts">
                    {technology.facts}
                  </Section>
                  {resources
                    .filter(resource => resource.technologyIds.includes(id))
                    .map(resource => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  <Button
                    outline
                    title="More Articles & Videos"
                    onPress={() => navigation.navigate('Learning')}
                  />
                  <SmallCard
                    item={
                      technologies[
                        (technologies.findIndex(value => value.id === id) + 1) %
                          technologies.length
                      ]
                    }
                    kind="technology"
                  />
                </>
              )}
              {kind === 'location' && (
                <Section title="Location Highlights">
                  {item.meta['Location Highlights']}
                </Section>
              )}
              {location && kind !== 'location' && (
                <View
                  style={[s.card, s.padded, s.row, { borderColor: '#075875' }]}
                >
                  <Icon name="pin" color={colors.cyan} />
                  <View style={s.fill}>
                    <Text
                      style={[s.eyebrow, { fontSize: 8, letterSpacing: 0.5 }]}
                    >
                      FESTIVAL LOCATION
                    </Text>
                    <Text style={[s.text, { fontSize: 13 }]}>
                      {location.title}
                    </Text>
                  </View>
                  <RoundButton
                    icon="map"
                    label={`Find ${location.title} on map`}
                    onPress={openMap}
                  />
                </View>
              )}
              {relatedShows.length > 0 && (
                <Section
                  title={
                    kind === 'location' ? 'Shows at This Venue' : 'Related Show'
                  }
                >
                  {relatedShows.map(value => (
                    <ShowCard key={value.id} show={value} />
                  ))}
                </Section>
              )}
              {kind === 'location' && item.id === 'hologram-art-gallery' && (
                <Button
                  title="Explore Gallery"
                  onPress={() =>
                    navigation.popTo('Main', { screen: 'Gallery' })
                  }
                />
              )}
              {kind === 'location' &&
                item.id === 'technology-discovery-center' && (
                  <Button
                    title="Explore Technology"
                    onPress={() => navigation.popTo('Main', { screen: 'Tech' })}
                  />
                )}
              {show ? (
                <Button
                  title="Choose Date & Book"
                  icon="next"
                  onPress={() =>
                    navigation.popTo('Main', {
                      screen: 'Booking',
                      params: { showId: show.id, section: 'book' },
                    })
                  }
                />
              ) : (
                <Button
                  title={technology ? 'Find Technology Zone' : 'Show on Map'}
                  icon="pin"
                  onPress={openMap}
                />
              )}
            </View>
          </Columns>
        </ScreenMotion>
      </ScrollView>
    </SafeAreaView>
  );
}
const d = StyleSheet.create({
  hero: { height: 320 },
  shade: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badge: {
    padding: 10,
    backgroundColor: '#0C1027AA',
    borderRadius: 8,
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
  },
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  fact: {
    flexGrow: 1,
    flexBasis: '45%',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
