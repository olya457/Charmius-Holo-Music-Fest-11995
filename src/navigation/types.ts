import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DetailKind } from '../types/models';
export type TabParams = {
  Shows: undefined;
  Gallery: undefined;
  Map: { locationId?: string } | undefined;
  Tech: undefined;
  Booking:
    | { showId?: string; performanceId?: string; section?: 'book' | 'bookings' }
    | undefined;
};
export type RootParams = {
  Splash: undefined;
  Onboarding: undefined;
  Main: NavigatorScreenParams<TabParams> | undefined;
  Detail: { kind: DetailKind; id: string };
  Ticket: { bookingId: string };
  About: undefined;
  Learning: undefined;
  Schedule: undefined;
};
export type RootNavigation = NativeStackNavigationProp<RootParams>;
