import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootParams } from '../navigation/types';
import { shows } from '../data';
import { images } from '../data/images';
import {
  formatPerformanceDate,
  isUpcoming,
  performances,
  programmeMonths,
  PROGRAMME_LABEL,
} from '../data/schedule';
import { useFestivalClock } from '../hooks/useFestivalClock';
import { Button, Filters, Page, RoundButton, Section } from '../components/ui';
import { Grid } from '../components/Responsive';
import { styles as s } from '../theme';
export function ScheduleScreen({
  navigation,
}: NativeStackScreenProps<RootParams, 'Schedule'>) {
  const now = useFestivalClock();
  const [month, setMonth] = useState(
    () =>
      programmeMonths.find(item =>
        performances.some(
          performance =>
            performance.date.startsWith(item.id) && isUpcoming(performance),
        ),
      )?.label ?? programmeMonths[0].label,
  );
  const [category, setCategory] = useState('All Shows');
  const monthId = programmeMonths.find(item => item.label === month)!.id;
  const entries = performances.filter(
    item =>
      item.date.startsWith(monthId) &&
      (category === 'All Shows' ||
        shows.find(show => show.id === item.showId)?.category === category),
  );
  const dates = [...new Set(entries.map(item => item.date))];
  return (
    <Page>
      <View style={s.row}>
        <RoundButton
          icon="back"
          label="Go back"
          onPress={() => navigation.goBack()}
        />
        <Text style={s.eyebrow}>SIX-MONTH PROGRAMME</Text>
      </View>
      <Text style={s.title}>Your Next Live Experience</Text>
      <Text style={s.muted}>
        {PROGRAMME_LABEL}. The same 15 performances return on the 21st, 22nd and
        23rd of every month.
      </Text>
      <Text style={s.small}>
        All times are in Europe/Kyiv. Select a performance to reserve that exact
        date.
      </Text>
      <Filters
        values={programmeMonths.map(item => item.label)}
        selected={month}
        onSelect={setMonth}
      />
      <Filters
        values={['All Shows', ...new Set(shows.map(item => item.category))]}
        selected={category}
        onSelect={setCategory}
      />
      <Text style={s.small}>{entries.length} performances this month</Text>
      {dates.map(date => (
        <Section key={date} title={formatPerformanceDate(date)}>
          <Grid>
            {entries
              .filter(item => item.date === date)
              .map(performance => {
                const show = shows.find(
                  item => item.id === performance.showId,
                )!;
                const upcoming = isUpcoming(performance, now);
                return (
                  <View key={performance.id} style={s.card}>
                    <Image
                      source={images[show.image]}
                      style={{ width: '100%', height: 160 }}
                    />
                    <View style={s.padded}>
                      <View style={s.between}>
                        <Text style={s.eyebrow}>{performance.time}</Text>
                        <Text style={s.small}>{show.duration} min</Text>
                      </View>
                      <Text style={s.heading}>{show.title}</Text>
                      <Text style={s.small}>
                        {show.category} · {show.venue}
                      </Text>
                      <Text style={s.muted}>{show.description}</Text>
                      <Button
                        title={
                          upcoming
                            ? 'Book This Performance'
                            : 'Performance Started / Past'
                        }
                        disabled={!upcoming}
                        onPress={() =>
                          navigation.popTo('Main', {
                            screen: 'Booking',
                            params: {
                              showId: show.id,
                              performanceId: performance.id,
                              section: 'book',
                            },
                          })
                        }
                      />
                      <Button
                        outline
                        title="Show Details"
                        onPress={() =>
                          navigation.navigate('Detail', {
                            kind: 'show',
                            id: show.id,
                          })
                        }
                      />
                    </View>
                  </View>
                );
              })}
          </Grid>
        </Section>
      ))}
    </Page>
  );
}
