import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { GradientSurface as LinearGradient } from '../components/GradientSurface';
import WebView from 'react-native-webview';
import { RootParams } from '../navigation/types';
import { images } from '../data/images';
import { useFestival } from '../storage/FestivalProvider';
import { colors, styles as s } from '../theme';
import { Button } from '../components/ui';
import { ScreenMotion, AuroraGlow } from '../components/Motion';
import { getIntroLayout } from '../utils/introLayout';
import { useMotion } from '../hooks/useMotion';
const animation = `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>html,body{margin:0;background:transparent;overflow:hidden;height:100%}body{display:flex;align-items:center;justify-content:center;gap:8px}.dot{width:7px;height:7px;background:#af8bff;border-radius:100%;animation:pulse 1s ease-in-out infinite}.dot:nth-child(2){animation-delay:.18s}.dot:nth-child(3){animation-delay:.36s}@keyframes pulse{50%{background:#00d8ff;transform:scale(1.6);box-shadow:0 0 16px #9d5bff}}</style></head><body><i class="dot"></i><i class="dot"></i><i class="dot"></i><script>setTimeout(function(){window.ReactNativeWebView.postMessage('finished')},4000)</script></body></html>`;
export function SplashScreen({
  navigation,
}: NativeStackScreenProps<RootParams, 'Splash'>) {
  const { ready, onboarded, error, retry } = useFestival();
  const [finished, setFinished] = useState(false);
  const started = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { width, height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const layout = getIntroLayout(width, height, insets, fontScale);
  const { logoSize } = layout;
  const { reduced } = useMotion();
  function start() {
    if (!started.current) {
      started.current = true;
      timer.current = setTimeout(() => setFinished(true), 4000);
    }
  }
  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
    [],
  );
  useEffect(() => {
    if (finished && ready) {
      navigation.replace(onboarded ? 'Main' : 'Onboarding');
    }
  }, [finished, ready, onboarded, navigation]);
  return (
    <ImageBackground source={images['splash-background']} style={s.fill}>
      <LinearGradient
        colors={['#090B2255', '#090B22AA', '#090B22DD']}
        style={s.fill}
      >
        <AuroraGlow />
        <SafeAreaView
          edges={['top', 'bottom']}
          style={[s.fill, { paddingHorizontal: layout.sidePadding }]}
        >
          <ScrollView
            contentContainerStyle={[i.splash, { flexGrow: 1 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={s.fill} />
            <Image
              source={images['charmius-logo']}
              style={{
                width: logoSize,
                height: logoSize * 1.05,
              }}
              resizeMode="contain"
            />
            <View style={s.fill} />
            <Text style={[s.eyebrow, { textAlign: 'center' }]}>
              HOLOGRAPHIC FESTIVAL 2026
            </Text>
            <Text style={[s.title, i.splashTitle]}>
              Charmius Holo{'\n'}Music
            </Text>
            {error ? (
              <View style={s.gap}>
                <Text style={s.muted}>{error}</Text>
                <Button title="Try Again" onPress={retry} />
              </View>
            ) : (
              <View style={i.web}>
                <WebView
                  originWhitelist={['*']}
                  source={{
                    html: reduced
                      ? animation.replace(
                          'animation:pulse 1s ease-in-out infinite',
                          'animation:none',
                        )
                      : animation,
                  }}
                  style={i.transparent}
                  scrollEnabled={false}
                  onLoadEnd={start}
                  onError={start}
                  onMessage={event => {
                    if (event.nativeEvent.data === 'finished') {
                      setFinished(true);
                    }
                  }}
                />
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}
const slides = [
  {
    image: 'festival-entrance',
    label: 'DISCOVER LIVE',
    title: 'Experience the Future of Music',
    body: 'Explore spectacular holographic concerts, virtual performers, immersive sound environments, and futuristic live entertainment.',
  },
  {
    image: 'holographic-concert',
    label: 'EXPLORE THE GROUNDS',
    title: 'Discover Every Digital Experience',
    body: 'Navigate concert stages, explore holographic art installations, discover technology exhibitions, and find your favorite festival locations.',
  },
  {
    image: 'festival-plaza',
    label: 'BOOK INSTANTLY',
    title: 'Reserve Your Place in Seconds',
    body: 'Choose your favorite performance, select the number of visitors, and receive a QR ticket. No registration or personal details required.',
  },
];
export function OnboardingScreen({
  navigation,
}: NativeStackScreenProps<RootParams, 'Onboarding'>) {
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const { completeOnboarding } = useFestival();
  const { width, height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const layout = getIntroLayout(width, height, insets, fontScale);
  const slide = slides[index];
  async function finish() {
    setBusy(true);
    try {
      await completeOnboarding();
      navigation.replace('Main');
    } catch {
      Alert.alert('Could not save', 'Please try again.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[s.page, { paddingHorizontal: layout.sidePadding }]}
    >
      <AuroraGlow />
      <ScrollView
        contentContainerStyle={i.onboardingScroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <ScreenMotion
          identity={index}
          style={[i.onboarding, layout.wide && i.onboardingWide]}
        >
          <ImageBackground
            source={images[slide.image]}
            resizeMode="cover"
            style={[
              i.hero,
              {
                height: layout.wide
                  ? Math.max(280, Math.min(520, layout.height - 48))
                  : Math.max(180, Math.min(420, layout.height * 0.48)),
              },
              layout.wide && i.onboardingPanel,
            ]}
          >
            <LinearGradient
              colors={['#0C102700', '#0C102700', '#0C1027']}
              locations={[0, 0.55, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={i.heroContent}>
              <Button
                outline
                title="Skip"
                onPress={finish}
                disabled={busy}
                style={i.skip}
              />
              <Text style={s.eyebrow}>✧ {slide.label}</Text>
            </View>
          </ImageBackground>
          <View
            style={[
              i.onboardingContent,
              { paddingHorizontal: layout.padding },
              layout.wide && i.onboardingPanel,
            ]}
          >
            <View style={i.dots}>
              {slides.map((_, n) => (
                <View key={n} style={[i.dot, n === index && i.activeDot]} />
              ))}
            </View>
            <Text style={[s.title, i.onboardingTitle]}>{slide.title}</Text>
            <Text style={[s.muted, i.onboardingDescription]}>{slide.body}</Text>
            <Button
              title={index === 2 ? 'Explore Festival' : 'Next'}
              icon="next"
              loading={busy}
              style={i.next}
              onPress={() => (index < 2 ? setIndex(index + 1) : finish())}
            />
            <Text style={[s.small, i.footer]}>
              Charmius Holo Music Fest · 2026
            </Text>
          </View>
        </ScreenMotion>
      </ScrollView>
    </SafeAreaView>
  );
}
const i = StyleSheet.create({
  onboardingScroll: { flexGrow: 1 },
  onboarding: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
    flexGrow: 1,
  },
  hero: { width: '100%', flexShrink: 0, overflow: 'hidden' },
  heroContent: {
    flex: 1,
    padding: 18,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  skip: { width: 76, alignSelf: 'flex-end' },
  onboardingContent: {
    paddingTop: 18,
    paddingBottom: 24,
    gap: 18,
    alignItems: 'stretch',
    justifyContent: 'center',
    flexGrow: 1,
  },
  onboardingTitle: {
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
  },
  onboardingDescription: {
    textAlign: 'center',
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  dot: { width: 6, height: 6, borderRadius: 4, backgroundColor: '#494762' },
  activeDot: { width: 23, backgroundColor: colors.cyan },
  next: { width: '100%', maxWidth: 420, alignSelf: 'center', marginTop: 8 },
  footer: { textAlign: 'center' },
  onboardingWide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    padding: 24,
  },
  onboardingPanel: { flex: 1, minWidth: 0, width: 'auto' },
  splash: { alignItems: 'center', padding: 20, paddingBottom: 30 },
  splashTitle: { textAlign: 'center', fontSize: 28, marginTop: 12 },
  web: { height: 64, width: 120, marginTop: 20 },
  transparent: { backgroundColor: 'transparent' },
});
