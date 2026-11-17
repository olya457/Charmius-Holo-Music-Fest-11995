import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '../types/models';
import { shows } from '../data';
import { validPerformanceSnapshot } from '../data/schedule';
export const BOOKING_KEY = '@charmius/bookings/v1';
export const ONBOARDING_KEY = '@charmius/onboarding/v1';
export function isBooking(value: unknown): value is Booking {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const booking = value as Booking;
  return (
    typeof booking.id === 'string' &&
    booking.id.length > 0 &&
    shows.some(show => show.id === booking.showId) &&
    Number.isInteger(booking.guests) &&
    booking.guests >= 1 &&
    booking.guests <= 10 &&
    typeof booking.createdAt === 'string' &&
    !Number.isNaN(Date.parse(booking.createdAt)) &&
    (booking.performance === undefined ||
      validPerformanceSnapshot(booking.performance, booking.showId))
  );
}
export async function readBookings(): Promise<Booking[]> {
  const raw = await AsyncStorage.getItem(BOOKING_KEY);
  if (!raw) {
    return [];
  }
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value) || !value.every(isBooking)) {
    throw new Error('Unable to read saved bookings.');
  }
  return value;
}
export async function writeBookings(bookings: Booking[]) {
  await AsyncStorage.setItem(BOOKING_KEY, JSON.stringify(bookings));
}
export function ticketPayload(booking: Booking) {
  return JSON.stringify({
    version: booking.performance ? 2 : 1,
    festival: booking.performance ? 'CharmiusHoloMusicFest' : 'HME2026',
    reference: booking.id,
    showId: booking.showId,
    guests: booking.guests,
    ...(booking.performance
      ? {
          performanceId: booking.performance.id,
          date: booking.performance.date,
          time: booking.performance.time,
          timeZone: booking.performance.timeZone,
        }
      : {}),
  });
}
