import React, { useEffect, useRef, useState } from 'react';
import { Image, PanResponder, Pressable, StyleSheet, View } from 'react-native';
import { locations } from '../data';
import { images } from '../data/images';
import { colors } from '../theme';
import { Icon } from './Icon';
import { RoundButton } from './ui';
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
export function FestivalMap({
  filter,
  selected,
  onSelect,
}: {
  filter: string;
  selected?: string;
  onSelect: (id: string) => void;
}) {
  const [width, setWidth] = useState(320);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  useEffect(() => {
    setTransform({ scale: 1, x: 0, y: 0 });
  }, [width]);
  const latest = useRef(transform);
  latest.current = transform;
  const start = useRef({ ...transform, distance: 0 });
  const geometry = useRef(width);
  geometry.current = width;
  function limit(scale: number, x: number, y: number) {
    const size = geometry.current;
    return {
      scale: clamp(scale, 1, 2.8),
      x: clamp(x, (-size * (scale - 1)) / 2, (size * (scale - 1)) / 2),
      y: clamp(y, (-420 * (scale - 1)) / 2, (420 * (scale - 1)) / 2),
    };
  }
  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: event =>
        event.nativeEvent.touches.length > 1,
      onMoveShouldSetPanResponder: (event, gesture) =>
        event.nativeEvent.touches.length > 1 ||
        Math.abs(gesture.dx) + Math.abs(gesture.dy) > 8,
      onPanResponderGrant: event => {
        const touches = event.nativeEvent.touches;
        start.current = {
          ...latest.current,
          distance:
            touches.length > 1
              ? Math.hypot(
                  touches[0].pageX - touches[1].pageX,
                  touches[0].pageY - touches[1].pageY,
                )
              : 0,
        };
      },
      onPanResponderMove: (event, gesture) => {
        const touches = event.nativeEvent.touches;
        if (touches.length > 1) {
          const distance = Math.hypot(
            touches[0].pageX - touches[1].pageX,
            touches[0].pageY - touches[1].pageY,
          );
          if (!start.current.distance) {
            start.current = { ...latest.current, distance };
          }
          const scale = clamp(
            (start.current.scale * distance) / start.current.distance,
            1,
            2.8,
          );
          setTransform(limit(scale, start.current.x, start.current.y));
        } else {
          setTransform(
            limit(
              start.current.scale,
              start.current.x + gesture.dx,
              start.current.y + gesture.dy,
            ),
          );
        }
      },
      onPanResponderTerminationRequest: () => false,
    }),
  ).current;
  function zoom(delta: number) {
    setTransform(value =>
      limit(clamp(value.scale + delta, 1, 2.8), value.x, value.y),
    );
  }
  return (
    <View
      style={m.frame}
      onLayout={event => setWidth(event.nativeEvent.layout.width)}
    >
      <View style={m.touch} {...responder.panHandlers}>
        <View
          style={{
            width,
            height: 420,
            transform: [
              { translateX: transform.x },
              { translateY: transform.y },
              { scale: transform.scale },
            ],
          }}
        >
          <Image
            source={images['festival-map']}
            style={m.background}
            resizeMode="cover"
          />
          <View style={m.tint} />
          {locations
            .filter(item => filter === 'All Locations' || item.group === filter)
            .map(item => {
              const color =
                item.group === 'Concerts'
                  ? colors.purple
                  : item.group === 'Exhibitions'
                  ? colors.cyan
                  : colors.pink;
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={item.title}
                  accessibilityState={{ selected: selected === item.id }}
                  onPress={() => onSelect(item.id)}
                  style={[
                    m.pin,
                    {
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      backgroundColor: color,
                      shadowColor: color,
                      borderWidth: selected === item.id ? 4 : 2,
                      transform: [{ scale: selected === item.id ? 1.2 : 1 }],
                    },
                  ]}
                >
                  <Icon
                    name={
                      item.group === 'Concerts'
                        ? 'shows'
                        : item.group === 'Exhibitions'
                        ? 'spark'
                        : 'pin'
                    }
                    color="white"
                    size={19}
                  />
                </Pressable>
              );
            })}
        </View>
      </View>
      <View style={m.controls}>
        <RoundButton
          icon="plus"
          label="Zoom in"
          onPress={() => zoom(0.4)}
          disabled={transform.scale >= 2.8}
        />
        <RoundButton
          icon="minus"
          label="Zoom out"
          onPress={() => zoom(-0.4)}
          disabled={transform.scale <= 1}
        />
      </View>
    </View>
  );
}
const m = StyleSheet.create({
  frame: {
    height: 420,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3E376C',
    backgroundColor: '#090C22',
  },
  touch: { flex: 1 },
  background: { width: '100%', height: '100%', opacity: 0.65 },
  tint: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#0C102740',
  },
  pin: {
    position: 'absolute',
    width: 38,
    height: 38,
    marginLeft: -19,
    marginTop: -19,
    borderColor: 'white',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  controls: { position: 'absolute', top: 12, right: 12, gap: 6 },
});
