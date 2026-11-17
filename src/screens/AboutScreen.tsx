import React from 'react';
import { Image, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootParams } from '../navigation/types';
import { Page, RoundButton, Section } from '../components/ui';
import { images } from '../data/images';
import { styles as s } from '../theme';
export function AboutScreen({
  navigation,
}: NativeStackScreenProps<RootParams, 'About'>) {
  return (
    <Page narrow>
      <RoundButton
        icon="back"
        label="Go back"
        onPress={() => navigation.goBack()}
      />
      <Image
        source={images['charmius-logo']}
        style={{ width: 180, height: 200, alignSelf: 'center' }}
        resizeMode="contain"
      />
      <Text style={s.title}>Charmius Holo Music Fest</Text>
      <Text style={s.eyebrow}>HOLOGRAPHIC FESTIVAL 2026</Text>
      <Section title="Explore the future of music">
        Discover holographic concerts, digital performers, interactive
        exhibitions and the technology behind each experience. Organized by
        Charmius Holo Music Fest.
      </Section>
      <Section title="Your offline festival guide">
        The catalogue, map and saved reservations are available without an
        internet connection. No account or personal details are required.
      </Section>
      <Section title="Your bookings">
        Reservations are stored only on this device. Removing the app or its
        data removes saved tickets. You can cancel a reservation from My
        Bookings.
      </Section>
      <Section title="Festival schedule">
        The programme runs from November 2026 to April 2027. Fifteen
        performances repeat on the 21st, 22nd and 23rd of each month. All times
        are in Europe/Kyiv. Reservations in this app are local records;
        admission verification requires the festival’s ticketing system.
      </Section>
    </Page>
  );
}
