import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { RootNavigation, TabParams } from '../navigation/types';
import { locations, shows } from '../data';
import { images } from '../data/images';
import { Page, Header, Filters, Button } from '../components/ui';
import { FestivalMap } from '../components/FestivalMap';
import { colors, styles as s } from '../theme';
import { Columns } from '../components/Responsive';
export function MapScreen({ route }: BottomTabScreenProps<TabParams, 'Map'>) {
  const navigation = useNavigation<RootNavigation>();
  const [filter, setFilter] = useState('All Locations');
  const [selected, setSelected] = useState<string | undefined>();
  useEffect(() => {
    if (route.params?.locationId) {
      setSelected(route.params.locationId);
      setFilter('All Locations');
    }
  }, [route.params]);
  const location = locations.find(item => item.id === selected);
  const related = shows.find(item => item.venue === location?.title);
  return (
    <Page>
      <Header
        title="Arena Map"
        subtitle="Explore stages, exhibitions and services across the HME festival grounds."
        eyebrow="OFFLINE FESTIVAL GUIDE"
      />
      <Filters
        values={['All Locations', 'Concerts', 'Exhibitions', 'Services']}
        selected={filter}
        onSelect={value => {
          setFilter(value);
          setSelected(undefined);
        }}
      />
      <View style={s.between}>
        <Text style={[s.small, { color: '#6FD6CE' }]}>↓ Available offline</Text>
        <Text style={s.small}>Drag · Pinch · Tap</Text>
      </View>
      <Columns>
        <FestivalMap
          filter={filter}
          selected={selected}
          onSelect={setSelected}
        />
        {location ? (
          <View style={[s.card, s.padded]}>
            <View style={s.row}>
              <Image
                source={images[location.image]}
                style={{ width: 80, height: 115, borderRadius: 12 }}
              />
              <View style={[s.fill, s.gap]}>
                <Text style={[s.eyebrow, { color: colors.cyan, fontSize: 9 }]}>
                  {location.category.toUpperCase()}
                </Text>
                <Text style={s.heading}>{location.title}</Text>
                <Text style={s.small} numberOfLines={3}>
                  {location.description}
                </Text>
              </View>
            </View>
            <Button
              outline
              title="View Details"
              onPress={() =>
                navigation.navigate('Detail', {
                  kind: 'location',
                  id: location.id,
                })
              }
            />
            {related && (
              <Button
                title="Related Show"
                onPress={() =>
                  navigation.navigate('Detail', {
                    kind: 'show',
                    id: related.id,
                  })
                }
              />
            )}
          </View>
        ) : (
          <View style={[s.card, s.padded]}>
            <Text style={s.heading}>Explore the festival</Text>
            <Text style={s.muted}>
              Tap a glowing marker to see its venue, exhibits and related shows.
              Pinch or use the controls to zoom.
            </Text>
          </View>
        )}
      </Columns>
      <View style={[s.row, { justifyContent: 'center', flexWrap: 'wrap' }]}>
        {['Concerts', 'Exhibitions', 'Services'].map((title, index) => (
          <Text key={title} style={s.small}>
            <Text
              style={{
                color: [colors.purple, colors.cyan, colors.pink][index],
              }}
            >
              ●{' '}
            </Text>
            {title}
          </Text>
        ))}
      </View>
      <Text style={s.small}>
        Festival overview · Select a location to explore.
      </Text>
    </Page>
  );
}
