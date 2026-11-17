import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '../types/models';
import { shows } from '../data';
import { performances, isUpcoming } from '../data/schedule';
import { ONBOARDING_KEY, readBookings, writeBookings } from './bookings';
type State = {
  ready: boolean;
  error: string | null;
  onboarded: boolean;
  bookings: Booking[];
  retry: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  book: (
    showId: string,
    guests: number,
    performanceId: string,
  ) => Promise<Booking>;
  cancel: (id: string) => Promise<void>;
};
const Context = createContext<State | null>(null);
export function FestivalProvider({ children }: React.PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onboarded, setOnboarded] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const current = useRef<Booking[]>([]);
  const busy = useRef(false);
  async function retry() {
    setError(null);
    try {
      const [saved, intro] = await Promise.all([
        readBookings(),
        AsyncStorage.getItem(ONBOARDING_KEY),
      ]);
      current.current = saved;
      setBookings(saved);
      setOnboarded(intro === 'true');
      setReady(true);
    } catch {
      setError('Your saved data could not be loaded. Please try again.');
    }
  }
  useEffect(() => {
    retry();
  }, []);
  async function completeOnboarding() {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setOnboarded(true);
  }
  async function book(showId: string, guests: number, performanceId: string) {
    if (!ready || busy.current) {
      throw new Error('Please wait and try again.');
    }
    if (
      !shows.some(show => show.id === showId) ||
      !Number.isInteger(guests) ||
      guests < 1 ||
      guests > 10
    ) {
      throw new Error('Choose a show and between 1 and 10 visitors.');
    }
    const performance = performances.find(
      item => item.id === performanceId && item.showId === showId,
    );
    if (!performance || !isUpcoming(performance)) {
      throw new Error('Choose an upcoming performance date.');
    }
    busy.current = true;
    try {
      const booking: Booking = {
        id: `HME-${Date.now().toString(36).toUpperCase()}-${Math.random()
          .toString(36)
          .slice(2, 7)
          .toUpperCase()}`,
        showId,
        guests,
        performance: { ...performance },
        createdAt: new Date().toISOString(),
      };
      const next = [booking, ...current.current];
      await writeBookings(next);
      current.current = next;
      setBookings(next);
      return booking;
    } finally {
      busy.current = false;
    }
  }
  async function cancel(id: string) {
    if (busy.current) {
      throw new Error('Please wait and try again.');
    }
    busy.current = true;
    try {
      const next = current.current.filter(item => item.id !== id);
      await writeBookings(next);
      current.current = next;
      setBookings(next);
    } finally {
      busy.current = false;
    }
  }
  return (
    <Context.Provider
      value={{
        ready,
        error,
        onboarded,
        bookings,
        retry,
        completeOnboarding,
        book,
        cancel,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useFestival() {
  const value = useContext(Context);
  if (!value) {
    throw new Error('FestivalProvider is missing');
  }
  return value;
}
