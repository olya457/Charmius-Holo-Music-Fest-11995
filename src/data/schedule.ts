import { shows } from './index';
export const FESTIVAL_TIME_ZONE = 'Europe/Kyiv';
export const PROGRAMME_LABEL = 'November 2026 – April 2027';
export type Performance = {
  id: string;
  showId: string;
  date: string;
  time: string;
  timeZone: string;
};
const pad = (value: number) => String(value).padStart(2, '0');
export const programmeMonths = Array.from({ length: 6 }, (_, offset) => {
  const month = new Date(Date.UTC(2026, 10 + offset, 1));
  return {
    id: `${month.getUTCFullYear()}-${pad(month.getUTCMonth() + 1)}`,
    label: month.toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }),
  };
});
export const performances: Performance[] = programmeMonths
  .flatMap(month =>
    shows.map((show, index) => {
      const date = `${month.id}-${21 + Math.floor(index / 5)}`;
      return {
        id: `${show.id}@${date}`,
        showId: show.id,
        date,
        time: show.time,
        timeZone: FESTIVAL_TIME_ZONE,
      };
    }),
  )
  .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
export function festivalNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: FESTIVAL_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const part = (type: string) =>
    parts.find(value => value.type === type)!.value;
  return `${part('year')}-${part('month')}-${part('day')}T${part(
    'hour',
  )}:${part('minute')}`;
}
export function isUpcoming(performance: Performance, now = new Date()) {
  return `${performance.date}T${performance.time}` > festivalNow(now);
}
export function showPerformances(showId: string) {
  return performances.filter(item => item.showId === showId);
}
export function formatPerformanceDate(date?: string) {
  return date
    ? new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : 'Date not selected';
}
export function validPerformanceSnapshot(
  value: unknown,
  showId: string,
): value is Performance {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const item = value as Performance;
  if (
    typeof item.date !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(item.date) ||
    typeof item.time !== 'string' ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(item.time)
  ) {
    return false;
  }
  const date = new Date(`${item.date}T12:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === item.date &&
    item.id === `${showId}@${item.date}` &&
    item.showId === showId &&
    item.timeZone === FESTIVAL_TIME_ZONE
  );
}
