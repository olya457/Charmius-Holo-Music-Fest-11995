import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { RootNavigation, TabParams } from '../navigation/types';
import { shows } from '../data';
import {
  performances,
  showPerformances,
  formatPerformanceDate,
  isUpcoming,
} from '../data/schedule';
import { useFestivalClock } from '../hooks/useFestivalClock';
import { images } from '../data/images';
import { Booking } from '../types/models';
import { useFestival } from '../storage/FestivalProvider';
import { Button, Header, Page, RoundButton } from '../components/ui';
import { Sheet } from '../components/Sheet';
import { Icon } from '../components/Icon';
import { colors, styles as s } from '../theme';
import { Columns, Grid } from '../components/Responsive';
import { useLayout } from '../hooks/useLayout';
export function BookingScreen({
  route,
}: BottomTabScreenProps<TabParams, 'Booking'>) {
  const navigation = useNavigation<RootNavigation>();
  const layout = useLayout();
  const now = useFestivalClock();
  const [performanceId, setPerformanceId] = useState<string>();
  const [datePicker, setDatePicker] = useState(false);
  const { bookings, book, cancel } = useFestival();
  const [section, setSection] = useState<'book' | 'bookings'>('book');
  const [showId, setShowId] = useState<string>();
  const [guests, setGuests] = useState(1);
  const [picker, setPicker] = useState(false);
  const [cancelling, setCancelling] = useState<Booking | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (route.params?.showId) {
      setShowId(route.params.showId);
      setPerformanceId(route.params.performanceId);
      setGuests(1);
    }
    if (route.params?.section) {
      setSection(route.params.section);
    }
  }, [route.params]);
  const show = shows.find(item => item.id === showId);
  const performance = performances.find(
    item => item.id === performanceId && item.showId === showId,
  );
  const available = !!performance && isUpcoming(performance, now);
  async function confirm() {
    if (!show || !performance || !available || busy) {
      return;
    }
    setBusy(true);
    try {
      const reservation = await book(show.id, guests, performance.id);
      setSection('bookings');
      navigation.navigate('Ticket', { bookingId: reservation.id });
    } catch {
      Alert.alert(
        'Booking was not saved',
        'Choose an upcoming date and try again. Your reservation appears only after it is saved on this device.',
      );
    } finally {
      setBusy(false);
    }
  }
  async function confirmCancel() {
    if (!cancelling || busy) {
      return;
    }
    setBusy(true);
    try {
      await cancel(cancelling.id);
      setCancelling(null);
    } catch {
      Alert.alert(
        'Could not cancel',
        'Your booking is still saved. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Page>
        <Header
          title="Book Your Experience"
          subtitle="Choose a performance and receive your private digital QR ticket. No account required."
          eyebrow="QUICK RESERVATION"
        />
        <View style={b.tabs}>
          {(['book', 'bookings'] as const).map(value => (
            <Pressable
              key={value}
              accessibilityRole="tab"
              accessibilityState={{ selected: section === value }}
              onPress={() => setSection(value)}
              style={[b.tab, section === value && b.active]}
            >
              <Text
                style={[
                  s.text,
                  { fontSize: 13, fontWeight: '700', textAlign: 'center' },
                ]}
              >
                {value === 'book'
                  ? 'Book a Show'
                  : `My Bookings${
                      bookings.length ? ` · ${bookings.length}` : ''
                    }`}
              </Text>
            </Pressable>
          ))}
        </View>
        {section === 'book' ? (
          <Columns>
            <View style={s.gap}>
              <View style={[s.card, s.padded]}>
                <Step number="1" title="Select Performance" />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Select performance"
                  onPress={() => setPicker(true)}
                  style={b.select}
                >
                  <Text style={[s.text, s.fill, { fontSize: 13 }]}>
                    {show
                      ? `${show.title} — ${show.time}`
                      : 'Choose a performance'}
                  </Text>
                  <Text style={s.text}>⌄</Text>
                </Pressable>
                {show && (
                  <Button
                    outline
                    title={
                      performance
                        ? formatPerformanceDate(performance.date)
                        : 'Select Date'
                    }
                    onPress={() => setDatePicker(true)}
                  />
                )}
                <Text style={s.small}>
                  All performance times are in Europe/Kyiv.
                </Text>
              </View>
              {show && (
                <View style={[s.card, s.padded, !layout.compact && s.row]}>
                  <Image
                    source={images[show.image]}
                    style={[
                      b.thumb,
                      layout.compact && { width: '100%', height: 150 },
                    ]}
                  />
                  <View style={[s.fill, s.gap]}>
                    <Text
                      style={[s.eyebrow, { fontSize: 8, letterSpacing: 0.3 }]}
                    >
                      {show.category}
                    </Text>
                    <Text style={s.heading}>{show.title}</Text>
                    <Text style={s.small}>
                      {show.venue}
                      {'\n'}
                      {formatPerformanceDate(performance?.date)}
                      {'\n'}
                      {show.time} · {show.duration} min
                    </Text>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() =>
                        navigation.navigate('Detail', {
                          kind: 'show',
                          id: show.id,
                        })
                      }
                    >
                      <Text style={s.link}>View show details</Text>
                    </Pressable>
                  </View>
                </View>
              )}
              <View style={[s.card, s.padded]}>
                <Step number="2" title="Number of Persons" />
                <View style={[s.between, { padding: 20 }]}>
                  <RoundButton
                    icon="minus"
                    label="Remove one guest"
                    disabled={guests <= 1}
                    onPress={() => setGuests(value => value - 1)}
                  />
                  <View style={s.center}>
                    <Text
                      style={[s.title, { fontSize: 40, fontWeight: '700' }]}
                    >
                      {guests}
                    </Text>
                    <Text style={s.small}>
                      {guests === 1 ? 'person' : 'persons'}
                    </Text>
                  </View>
                  <RoundButton
                    icon="plus"
                    label="Add one guest"
                    disabled={guests >= 10}
                    onPress={() => setGuests(value => value + 1)}
                  />
                </View>
                <Text style={[s.small, { textAlign: 'center' }]}>
                  Maximum 10 visitors per reservation
                </Text>
              </View>
            </View>
            <View style={[s.card, s.padded]}>
              <Step number="3" title="Confirm Reservation" />
              <View style={b.summary}>
                {[
                  ['Selected Show', show?.title ?? 'Choose a performance'],
                  ['Venue', show?.venue ?? '—'],
                  ['Date', formatPerformanceDate(performance?.date)],
                  ['Time (Kyiv)', show?.time ?? '—'],
                  ['Persons', String(guests)],
                ].map(([label, value]) => (
                  <View key={label} style={b.summaryRow}>
                    <Text style={[s.small, { flex: 1 }]}>{label}</Text>
                    <Text
                      style={[
                        s.text,
                        {
                          fontSize: 12,
                          fontWeight: '700',
                          flex: 1.6,
                          textAlign: 'right',
                        },
                      ]}
                    >
                      {value}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={s.row}>
                <Icon name="info" size={17} />
                <Text style={[s.small, s.fill]}>
                  No personal information is collected. Your ticket is stored
                  only on this device.
                </Text>
              </View>
              <Button
                title="Confirm Booking"
                icon="next"
                disabled={!show || !available}
                loading={busy}
                onPress={confirm}
              />
            </View>
          </Columns>
        ) : bookings.length === 0 ? (
          <View style={[s.card, b.empty]}>
            <View style={b.emptyIcon}>
              <Icon name="booking" color="#A28AFF" size={34} />
            </View>
            <Text style={s.heading}>No bookings yet</Text>
            <Text style={[s.muted, { textAlign: 'center' }]}>
              Your festival reservations and offline QR tickets will appear
              here.
            </Text>
            <Button
              title="Book Your First Show"
              onPress={() => setSection('book')}
            />
          </View>
        ) : (
          <Grid>
            {bookings.map(booking => {
              const bookedShow = shows.find(
                item => item.id === booking.showId,
              )!;
              return (
                <View key={booking.id} style={[s.card, s.padded]}>
                  <View style={layout.compact ? s.gap : s.row}>
                    <Image
                      source={images[bookedShow.image]}
                      style={[
                        b.thumb,
                        layout.compact && { width: '100%', height: 150 },
                      ]}
                    />
                    <View style={[s.fill, s.gap]}>
                      <Text style={b.confirmed}>CONFIRMED</Text>
                      <Text style={s.heading}>{bookedShow.title}</Text>
                      <Text style={s.small}>
                        {formatPerformanceDate(booking.performance?.date)}
                        {'\n'}
                        {booking.performance?.time ?? bookedShow.time} · Kyiv ·{' '}
                        {bookedShow.venue}
                      </Text>
                      <Text style={s.small}>
                        {booking.guests}{' '}
                        {booking.guests === 1 ? 'person' : 'persons'} ·{' '}
                        {booking.id}
                      </Text>
                    </View>
                  </View>
                  <Button
                    outline
                    title="View QR Code"
                    onPress={() =>
                      navigation.navigate('Ticket', { bookingId: booking.id })
                    }
                  />
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setCancelling(booking)}
                    style={{ paddingVertical: 10 }}
                  >
                    <Text style={{ color: colors.danger, fontSize: 13 }}>
                      Cancel booking
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </Grid>
        )}
      </Page>
      <Sheet
        scrollable={false}
        visible={picker}
        onClose={() => setPicker(false)}
      >
        <Text style={s.heading}>Select Performance</Text>
        <ScrollView>
          {shows.map(item => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              onPress={() => {
                setShowId(item.id);
                setPerformanceId(undefined);
                setPicker(false);
              }}
              style={b.choice}
            >
              <View style={s.fill}>
                <Text style={s.text}>{item.title}</Text>
                <Text style={s.small}>
                  {item.time} · {item.venue}
                </Text>
              </View>
              {item.id === showId && <Icon name="check" color={colors.cyan} />}
            </Pressable>
          ))}
        </ScrollView>
        <Button outline title="Close" onPress={() => setPicker(false)} />
      </Sheet>
      <Sheet visible={datePicker} onClose={() => setDatePicker(false)}>
        <Text style={s.heading}>Select Date</Text>
        <Text style={s.small}>Europe/Kyiv · Monthly programme</Text>
        {showPerformances(showId ?? '').map(item => (
          <Button
            key={item.id}
            outline
            disabled={!isUpcoming(item, now)}
            title={`${formatPerformanceDate(item.date)} · ${item.time}`}
            onPress={() => {
              setPerformanceId(item.id);
              setDatePicker(false);
            }}
          />
        ))}
        <Button outline title="Close" onPress={() => setDatePicker(false)} />
      </Sheet>
      <Sheet
        light
        visible={!!cancelling}
        onClose={() => {
          if (!busy) {
            setCancelling(null);
          }
        }}
      >
        <Text style={[s.heading, { color: '#17172C', textAlign: 'center' }]}>
          Cancel this booking?
        </Text>
        <Text style={[s.muted, { color: '#686779', textAlign: 'center' }]}>
          This reservation and its QR ticket will be removed from this device.
        </Text>
        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={confirmCancel}
          style={b.cancel}
        >
          <Text
            style={{ color: 'white', fontWeight: '700', textAlign: 'center' }}
          >
            {busy ? 'Cancelling…' : 'Cancel Booking'}
          </Text>
        </Pressable>
        <Button
          outline
          title="Keep Booking"
          disabled={busy}
          onPress={() => setCancelling(null)}
        />
      </Sheet>
    </>
  );
}
function Step({ number, title }: { number: string; title: string }) {
  return (
    <View style={s.row}>
      <View style={b.step}>
        <Text style={{ color: '#AD8AFF', fontSize: 12 }}>{number}</Text>
      </View>
      <Text style={[s.text, s.fill]}>{title}</Text>
    </View>
  );
}
const b = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#15142C',
    padding: 3,
    borderRadius: 14,
  },
  tab: { flex: 1, padding: 12, borderRadius: 11, justifyContent: 'center' },
  active: { backgroundColor: '#2A244C' },
  step: {
    width: 25,
    height: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9D75FF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A204D',
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#504373',
    borderRadius: 13,
    backgroundColor: '#1D1C39',
  },
  thumb: { width: 96, height: 145, borderRadius: 13 },
  summary: { padding: 12, borderRadius: 15, backgroundColor: '#1D1C38' },
  summaryRow: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  empty: {
    padding: 30,
    paddingVertical: 50,
    gap: 22,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  emptyIcon: { padding: 22, borderRadius: 26, backgroundColor: '#231D44' },
  confirmed: {
    color: '#63E8BE',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    alignSelf: 'flex-start',
    padding: 8,
    backgroundColor: '#163A43',
    borderRadius: 12,
  },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancel: { padding: 17, borderRadius: 13, backgroundColor: colors.danger },
});
