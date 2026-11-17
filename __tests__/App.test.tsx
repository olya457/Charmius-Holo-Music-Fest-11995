jest.mock('@react-navigation/bottom-tabs', () => ({
  BottomTabBarHeightContext: jest
    .requireActual('react')
    .createContext(undefined),
}));
jest.mock('../src/hooks/useFestivalClock', () => ({
  useFestivalClock: () => new Date('2026-11-17T10:00:00Z'),
}));
import { showPerformances } from '../src/data/schedule';
jest.mock('../src/data/schedule', () => {
  const actual = jest.requireActual('../src/data/schedule');
  return {
    ...actual,
    isUpcoming: (performance: unknown) =>
      actual.isUpcoming(performance, new Date('2026-11-17T10:00:00Z')),
  };
});
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FestivalProvider, useFestival } from '../src/storage/FestivalProvider';
import { SplashScreen, OnboardingScreen } from '../src/screens/IntroScreens';
import { Button } from '../src/components/ui';
import { BookingScreen } from '../src/screens/BookingScreen';
import { BOOKING_KEY, isBooking, ticketPayload } from '../src/storage/bookings';
import { shows, exhibits, technologies, locations } from '../src/data';
import { images } from '../src/data/images';
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useIsFocused: () => true,
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
}));
jest.mock('react-native-webview', () => 'WebView');
jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: 'SafeAreaView',
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock('../src/components/Icon', () => ({ Icon: 'Icon' }));
let state: ReturnType<typeof useFestival>;
function Probe() {
  state = useFestival();
  return null;
}
async function mount(children?: React.ReactNode) {
  let renderer!: TestRenderer.ReactTestRenderer;
  await act(async () => {
    renderer = TestRenderer.create(
      <FestivalProvider>
        <Probe />
        {children}
      </FestivalProvider>,
    );
  });
  return renderer;
}
beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(AsyncStorage.getItem).mockResolvedValue(null);
  jest.mocked(AsyncStorage.setItem).mockResolvedValue();
});
test('catalogue contains valid local images and linked venues', () => {
  for (const item of [...shows, ...exhibits, ...technologies, ...locations]) {
    expect(images[item.image]).toBeDefined();
    expect(item.description.length).toBeGreaterThan(20);
    expect(item.body.length).toBeGreaterThan(20);
  }
  for (const show of shows) {
    expect(locations.some(location => location.title === show.venue)).toBe(
      true,
    );
  }
  for (const item of technologies) {
    expect(item.how).not.toBe('');
    expect(item.facts).not.toBe('');
  }
});
test('starts empty, persists a booking, restores it and cancels it', async () => {
  const first = await mount();
  expect(state.bookings).toEqual([]);
  await act(async () => {
    await state.book(shows[0].id, 3, showPerformances(shows[0].id)[0].id);
  });
  const saved = state.bookings[0];
  expect(isBooking(saved)).toBe(true);
  expect(JSON.parse(ticketPayload(saved))).toMatchObject({
    reference: saved.id,
    guests: 3,
    showId: shows[0].id,
  });
  expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
    BOOKING_KEY,
    JSON.stringify([saved]),
  );
  await act(async () => first.unmount());
  jest
    .mocked(AsyncStorage.getItem)
    .mockImplementation(async key =>
      key === BOOKING_KEY ? JSON.stringify([saved]) : null,
    );
  const second = await mount();
  expect(state.bookings).toEqual([saved]);
  await act(async () => {
    await state.cancel(saved.id);
  });
  expect(state.bookings).toEqual([]);
  expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(BOOKING_KEY, '[]');
  await act(async () => second.unmount());
});
test('storage failures do not create or remove reservations', async () => {
  const renderer = await mount();
  jest
    .mocked(AsyncStorage.setItem)
    .mockRejectedValueOnce(new Error('disk full'));
  await act(async () => {
    await expect(
      state.book(shows[0].id, 1, showPerformances(shows[0].id)[0].id),
    ).rejects.toThrow();
  });
  expect(state.bookings).toEqual([]);
  await act(async () => {
    await state.book(shows[0].id, 1, showPerformances(shows[0].id)[0].id);
  });
  jest
    .mocked(AsyncStorage.setItem)
    .mockRejectedValueOnce(new Error('disk full'));
  await act(async () => {
    await expect(state.cancel(state.bookings[0].id)).rejects.toThrow();
  });
  expect(state.bookings).toHaveLength(1);
  await act(async () => renderer.unmount());
});
test('rejects invalid guest counts and protects unreadable saved data', async () => {
  const renderer = await mount();
  for (const guests of [0, 11, 1.5]) {
    await expect(
      state.book(shows[0].id, guests, showPerformances(shows[0].id)[0].id),
    ).rejects.toThrow();
  }
  await act(async () => renderer.unmount());
  jest.mocked(AsyncStorage.getItem).mockResolvedValue('{broken');
  const broken = await mount();
  expect(state.ready).toBe(false);
  expect(state.error).toBeTruthy();
  expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  await act(async () => broken.unmount());
});
test('booking screen confirms the selected show and opens its ticket', async () => {
  const route = {
    key: 'Booking',
    name: 'Booking' as const,
    params: {
      showId: shows[1].id,
      performanceId: showPerformances(shows[1].id)[0].id,
      section: 'book' as const,
    },
  };
  const renderer = await mount(
    <BookingScreen route={route} navigation={{} as never} />,
  );
  const add = renderer.root.findAll(
    node =>
      node.props.accessibilityLabel === 'Add one guest' &&
      typeof node.props.onPress === 'function',
  )[0];
  await act(async () => add.props.onPress());
  const button = renderer.root.findAll(
    node =>
      node.props.accessibilityLabel === 'Confirm Booking' &&
      typeof node.props.onPress === 'function',
  )[0];
  await act(async () => button.props.onPress());
  expect(state.bookings[0]).toMatchObject({ showId: shows[1].id, guests: 2 });
  expect(mockNavigate).toHaveBeenCalledWith('Ticket', {
    bookingId: state.bookings[0].id,
  });
  await act(async () => renderer.unmount());
});

test('splash waits four seconds before opening onboarding', async () => {
  const replace = jest.fn();
  const renderer = await mount(
    <SplashScreen
      navigation={{ replace } as never}
      route={{ key: 'Splash', name: 'Splash' }}
    />,
  );
  jest.useFakeTimers();
  const web = renderer.root.findAll(
    node => typeof node.props.onLoadEnd === 'function',
  )[0];
  act(() => web.props.onLoadEnd());
  act(() => jest.advanceTimersByTime(3999));
  expect(replace).not.toHaveBeenCalled();
  act(() => jest.advanceTimersByTime(1));
  expect(replace).toHaveBeenCalledWith('Onboarding');
  await act(async () => renderer.unmount());
  jest.useRealTimers();
});

test('folding the window preserves the selected performance and guest count', async () => {
  const native = require('react-native');
  const windowSize = jest
    .spyOn(native, 'useWindowDimensions')
    .mockReturnValue({ width: 320, height: 568, scale: 2, fontScale: 1 });
  const route = {
    key: 'Booking',
    name: 'Booking' as const,
    params: {
      showId: shows[2].id,
      performanceId: showPerformances(shows[2].id)[0].id,
      section: 'book' as const,
    },
  };
  const screen = (
    <FestivalProvider>
      <Probe />
      <BookingScreen route={route} navigation={{} as never} />
    </FestivalProvider>
  );
  let renderer!: TestRenderer.ReactTestRenderer;
  await act(async () => {
    renderer = TestRenderer.create(screen);
  });
  const add = renderer.root.findAll(
    node =>
      node.props.accessibilityLabel === 'Add one guest' &&
      typeof node.props.onPress === 'function',
  )[0];
  await act(async () => add.props.onPress());
  for (const width of [840, 1194, 320]) {
    windowSize.mockReturnValue({ width, height: 780, scale: 2, fontScale: 1 });
    await act(async () =>
      renderer.update(
        <FestivalProvider>
          <Probe />
          <BookingScreen route={route} navigation={{} as never} />
        </FestivalProvider>,
      ),
    );
  }
  const button = renderer.root.findAll(
    node =>
      node.props.accessibilityLabel === 'Confirm Booking' &&
      typeof node.props.onPress === 'function',
  )[0];
  await act(async () => button.props.onPress());
  expect(state.bookings[0]).toMatchObject({ showId: shows[2].id, guests: 2 });
  await act(async () => renderer.unmount());
  windowSize.mockRestore();
});

test('button dimensions belong to the animated container and gradient never wraps its label', async () => {
  const { StyleSheet, Text } = require('react-native');
  let renderer!: TestRenderer.ReactTestRenderer;
  await act(async () => {
    renderer = TestRenderer.create(
      <Button
        title="Next"
        onPress={() => {}}
        style={{ width: 320, marginTop: 8 }}
      />,
    );
  });
  const button = renderer.root.findByType(Button);
  const container = button.children[0] as TestRenderer.ReactTestInstance;
  expect(StyleSheet.flatten(container.props.style)).toMatchObject({
    width: 320,
    marginTop: 8,
    flexShrink: 0,
  });
  const gradient = renderer.root.findAll(
    node => node.type === ('LinearGradient' as never),
  )[0];
  expect(gradient.findAllByType(Text)).toHaveLength(0);
  expect(
    renderer.root.findAll(node => node.props.children === 'Next').length,
  ).toBeGreaterThan(0);
  await act(async () => renderer.unmount());
});

test('onboarding keeps full-width actions across small and expanded windows and finishes all slides', async () => {
  const native = require('react-native');
  const windowSize = jest
    .spyOn(native, 'useWindowDimensions')
    .mockReturnValue({ width: 402, height: 874, scale: 3, fontScale: 1 });
  const replace = jest.fn();
  const props = {
    route: { key: 'Onboarding', name: 'Onboarding' as const },
    navigation: { replace } as never,
  };
  const renderer = await mount(<OnboardingScreen {...props} />);
  for (const width of [320, 626, 1194, 402]) {
    windowSize.mockReturnValue({ width, height: 874, scale: 3, fontScale: 1 });
    await act(async () =>
      renderer.update(
        <FestivalProvider>
          <Probe />
          <OnboardingScreen {...props} />
        </FestivalProvider>,
      ),
    );
    const buttons = renderer.root.findAllByType(Button);
    expect(
      native.StyleSheet.flatten(
        buttons.find(node => node.props.title === 'Skip')!.props.style,
      ),
    ).toMatchObject({ width: 76 });
    expect(
      native.StyleSheet.flatten(
        buttons.find(node => node.props.title === 'Next')!.props.style,
      ),
    ).toMatchObject({ width: '100%' });
  }
  for (let step = 0; step < 2; step++) {
    const next = renderer.root
      .findAllByType(Button)
      .find(node => node.props.title === 'Next')!;
    await act(async () => next.props.onPress());
  }
  const finish = renderer.root
    .findAllByType(Button)
    .find(node => node.props.title === 'Explore Festival')!;
  await act(async () => finish.props.onPress());
  expect(replace).toHaveBeenCalledWith('Main');
  expect(AsyncStorage.setItem).toHaveBeenCalledWith(
    '@charmius/onboarding/v1',
    'true',
  );
  await act(async () => renderer.unmount());
  windowSize.mockRestore();
});

test('rejects absent or mismatched dates and preserves dated QR snapshots', async () => {
  const renderer = await mount();
  await act(async () => {
    await expect(state.book(shows[0].id, 1, 'unknown')).rejects.toThrow();
    await expect(
      state.book(shows[0].id, 1, showPerformances(shows[1].id)[0].id),
    ).rejects.toThrow();
    await state.book(shows[0].id, 1, showPerformances(shows[0].id)[5].id);
  });
  const saved = state.bookings[0];
  expect(JSON.parse(ticketPayload(saved))).toMatchObject({
    version: 2,
    date: '2027-04-21',
    time: shows[0].time,
    timeZone: 'Europe/Kyiv',
  });
  const { performance, ...legacy } = saved;
  expect(performance).toBeDefined();
  expect(isBooking(legacy)).toBe(true);
  expect(JSON.parse(ticketPayload(legacy))).toMatchObject({
    version: 1,
    festival: 'HME2026',
  });
  expect(JSON.parse(ticketPayload(legacy)).date).toBeUndefined();
  await act(async () => renderer.unmount());
});

test('booking requires explicit date selection', async () => {
  const renderer = await mount(
    <BookingScreen
      route={{
        key: 'Booking',
        name: 'Booking',
        params: { showId: shows[0].id },
      }}
      navigation={{} as never}
    />,
  );
  const confirm = () =>
    renderer.root
      .findAllByType(Button)
      .find(item => item.props.title === 'Confirm Booking')!;
  expect(confirm().props.disabled).toBe(true);
  await act(async () =>
    renderer.root
      .findAllByType(Button)
      .find(item => item.props.title === 'Select Date')!
      .props.onPress(),
  );
  const date = renderer.root
    .findAllByType(Button)
    .find(item => item.props.title.includes('21 Apr 2027'))!;
  await act(async () => date.props.onPress());
  expect(confirm().props.disabled).toBe(false);
  await act(async () => confirm().props.onPress());
  expect(state.bookings[0].performance?.date).toBe('2027-04-21');
  await act(async () => renderer.unmount());
});

test('floating navigation changes orientation and preserves tab events', async () => {
  const { renderFloatingTabBar } = require('../src/navigation/FloatingTabBar');
  const { isNavigationRail } = require('../src/navigation/tabLayout');
  const native = require('react-native');
  const size = jest
    .spyOn(native, 'useWindowDimensions')
    .mockReturnValue({ width: 402, height: 874, scale: 3, fontScale: 1 });
  const routes = ['Shows', 'Gallery', 'Map', 'Tech', 'Booking'].map(name => ({
    key: name,
    name,
  }));
  const emit = jest.fn(() => ({ defaultPrevented: false }));
  const navigate = jest.fn();
  const props = {
    state: { index: 2, routes },
    descriptors: Object.fromEntries(
      routes.map(route => [route.key, { options: {} }]),
    ),
    navigation: { emit, navigate },
  };
  let renderer!: TestRenderer.ReactTestRenderer;
  await act(async () => {
    renderer = TestRenderer.create(renderFloatingTabBar(props));
  });
  expect(renderer.root.findByType(native.ScrollView).props.horizontal).toBe(
    true,
  );
  expect(isNavigationRail(580, 340)).toBe(false);
  for (const [width, height, rail] of [
    [840, 600, true],
    [1194, 800, true],
    [402, 874, false],
  ] as const) {
    size.mockReturnValue({ width, height, scale: 3, fontScale: 1 });
    await act(async () => renderer.update(renderFloatingTabBar(props)));
    expect(renderer.root.findByType(native.ScrollView).props.horizontal).toBe(
      !rail,
    );
    const buttons = routes.map(
      route =>
        renderer.root.findAll(
          node =>
            node.props.testID === `tab-${route.name}` &&
            typeof node.props.onPress === 'function',
        )[0],
    );
    expect(buttons).toHaveLength(5);
    expect(buttons[2].props.accessibilityState.selected).toBe(true);
  }
  const buttons = routes.map(
    route =>
      renderer.root.findAll(
        node =>
          node.props.testID === `tab-${route.name}` &&
          typeof node.props.onPress === 'function',
      )[0],
  );
  await act(async () => buttons[4].props.onPress());
  expect(navigate).toHaveBeenCalledWith('Booking', undefined);
  emit.mockReturnValueOnce({ defaultPrevented: true });
  await act(async () => buttons[0].props.onPress());
  expect(navigate).toHaveBeenCalledTimes(1);
  await act(async () => buttons[2].props.onLongPress());
  expect(emit).toHaveBeenLastCalledWith({
    type: 'tabLongPress',
    target: 'Map',
  });
  await act(async () => renderer.unmount());
  size.mockRestore();
});
