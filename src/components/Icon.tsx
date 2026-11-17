import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
export type IconName =
  | 'shows'
  | 'gallery'
  | 'map'
  | 'tech'
  | 'booking'
  | 'back'
  | 'next'
  | 'pin'
  | 'clock'
  | 'info'
  | 'plus'
  | 'minus'
  | 'check'
  | 'download'
  | 'spark';
export function Icon({
  name,
  color = '#A5A5BE',
  size = 23,
}: {
  name: IconName;
  color?: string;
  size?: number;
}) {
  const paths: Partial<Record<IconName, string>> = {
    shows: 'M3 21h18M5 18V8l7-5 7 5v10M9 18v-7h6v7',
    gallery: 'M4 18l5-6 4 4 3-5 4 6',
    map: 'M3 5l6-2 6 3 6-2v16l-6 2-6-3-6 2zM9 3v16M15 6v16',
    tech: 'M12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2',
    booking: 'M5 5h14v17H5zM8 2v6M16 2v6M8 12h8M8 16h6',
    back: 'M15 5l-7 7 7 7',
    next: 'M9 5l7 7-7 7',
    pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1116 0z',
    clock: 'M12 6v6l4 2',
    info: 'M12 10v7M12 6v1',
    plus: 'M5 12h14M12 5v14',
    minus: 'M5 12h14',
    check: 'M5 12l4 4L19 6',
    download: 'M12 2v13M7 10l5 5 5-5M4 20h16',
    spark: 'M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z',
  };
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.65}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === 'gallery' && (
        <>
          <Rect x="3" y="3" width="18" height="18" rx="3" />
          <Circle cx="8" cy="8" r="1.5" />
        </>
      )}
      {(name === 'clock' || name === 'info') && (
        <Circle cx="12" cy="12" r="9" />
      )}
      {name === 'tech' && <Circle cx="12" cy="12" r="4" />}
      {name === 'pin' && <Circle cx="12" cy="10" r="2.5" />}
      <Path d={paths[name]} />
    </Svg>
  );
}
