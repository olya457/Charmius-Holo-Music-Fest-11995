import React from 'react';
import { Text, View, StyleSheet, useWindowDimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootParams } from '../navigation/types';
import { shows } from '../data';
import { formatPerformanceDate } from '../data/schedule';
import { useFestival } from '../storage/FestivalProvider';
import { ticketPayload } from '../storage/bookings';
import { Button, Page, RoundButton } from '../components/ui';
import { Icon } from '../components/Icon';
import { colors, styles as s } from '../theme';
import { useLayout } from '../hooks/useLayout';
export function TicketScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootParams, 'Ticket'>) {
  const { bookings } = useFestival();
  const { width } = useWindowDimensions();
  const layout = useLayout();
  const booking = bookings.find(item => item.id === route.params.bookingId);
  const show = shows.find(item => item.id === booking?.showId);
  function myBookings() {
    navigation.popTo('Main', {
      screen: 'Booking',
      params: { section: 'bookings' },
    });
  }
  if (!booking || !show) {
    return (
      <Page narrow>
        <Text style={s.title}>Ticket unavailable</Text>
        <Text style={s.muted}>This booking may have been cancelled.</Text>
        <Button title="View My Bookings" onPress={myBookings} />
      </Page>
    );
  }
  return (
    <Page narrow>
      <View style={s.between}>
        <RoundButton
          icon="back"
          label="Go back"
          onPress={() => navigation.goBack()}
        />
        <Text style={[s.text, { fontWeight: '700' }]}>Digital Ticket</Text>
        <View style={{ width: 44 }} />
      </View>
      <View style={[s.center, s.gap]}>
        <View style={t.icon}>
          <Icon name="spark" size={30} color="white" />
        </View>
        <Text style={[s.title, { fontSize: 28, textAlign: 'center' }]}>
          Booking Confirmed
        </Text>
        <Text style={[s.muted, { textAlign: 'center' }]}>
          Your reservation is saved. Your QR ticket is available offline on this
          device.
        </Text>
      </View>
      <View style={t.ticket}>
        <View style={[s.center, { gap: 8, padding: 24 }]}>
          <Text style={t.brand}>HME 2026–27</Text>
          <Text style={t.label}>FESTIVAL RESERVATION</Text>
          <View style={t.qr}>
            <QRCode
              value={ticketPayload(booking)}
              size={Math.min(230, width - 128)}
              color="#0A0C20"
              backgroundColor="white"
              ecl="M"
            />
          </View>
          <Text style={t.label}>Your personal booking QR code</Text>
        </View>
        <View style={t.divider} />
        <View style={{ padding: 20, gap: 24 }}>
          <Text style={t.title}>{show.title}</Text>
          <View style={t.grid}>
            {[
              ['DATE', formatPerformanceDate(booking.performance?.date)],
              ['TIME (KYIV)', booking.performance?.time ?? show.time],
              ['DURATION', `${show.duration} min`],
              ['VENUE', show.venue],
              ['GUESTS', String(booking.guests)],
            ].map(([label, value]) => (
              <View
                key={label}
                style={{ width: layout.compact ? '100%' : '46%', gap: 6 }}
              >
                <Text style={t.label}>{label}</Text>
                <Text style={t.value}>{value}</Text>
              </View>
            ))}
          </View>
          <View
            style={{
              borderTopWidth: 1,
              borderColor: '#DDDAE8',
              paddingTop: 15,
              gap: 6,
            }}
          >
            <Text style={t.label}>BOOKING REFERENCE</Text>
            <Text selectable style={[t.value, { letterSpacing: 1 }]}>
              {booking.id}
            </Text>
            <Text style={{ color: '#168D77', fontWeight: '800', fontSize: 10 }}>
              CONFIRMED
            </Text>
          </View>
        </View>
      </View>
      <Button outline title="View My Bookings" onPress={myBookings} />
      <View style={[s.row, { justifyContent: 'center' }]}>
        <Icon name="download" size={16} color="#73DBCD" />
        <Text style={{ color: '#73DBCD', fontSize: 13 }}>
          Saved offline on this device
        </Text>
      </View>
    </Page>
  );
}
const t = StyleSheet.create({
  icon: { backgroundColor: colors.purple, padding: 17, borderRadius: 40 },
  ticket: { borderRadius: 23, backgroundColor: '#F8F6FF', overflow: 'hidden' },
  brand: { color: '#17172F', fontWeight: '900', fontSize: 17 },
  label: { color: '#77768A', fontSize: 9, letterSpacing: 0.7 },
  qr: {
    padding: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDDAE8',
    marginVertical: 12,
  },
  divider: { borderTopWidth: 1, borderColor: '#BDB9CA', borderStyle: 'dashed' },
  title: { color: '#17172F', fontSize: 23, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  value: { color: '#17172F', fontSize: 13, fontWeight: '700' },
});
