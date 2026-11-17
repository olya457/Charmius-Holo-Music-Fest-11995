import { shows } from '../src/data';
import {
  festivalNow,
  isUpcoming,
  performances,
  programmeMonths,
  showPerformances,
  validPerformanceSnapshot,
} from '../src/data/schedule';

test('six months repeat all fifteen shows with unique dated occurrences', () => {
  expect(programmeMonths.map(item => item.id)).toEqual([
    '2026-11',
    '2026-12',
    '2027-01',
    '2027-02',
    '2027-03',
    '2027-04',
  ]);
  expect(performances).toHaveLength(90);
  expect(new Set(performances.map(item => item.id)).size).toBe(90);
  for (const month of programmeMonths) {
    expect(
      performances.filter(item => item.date.startsWith(month.id)),
    ).toHaveLength(15);
  }
  for (const show of shows) {
    const entries = showPerformances(show.id);
    expect(entries).toHaveLength(6);
    expect(new Set(entries.map(item => item.date.slice(8))).size).toBe(1);
    expect(
      entries.every(
        item =>
          item.time === show.time && validPerformanceSnapshot(item, show.id),
      ),
    ).toBe(true);
  }
});

test('performances at the same venue do not overlap', () => {
  const intervals = performances.map(item => {
    const show = shows.find(value => value.id === item.showId)!;
    const start = Date.parse(`${item.date}T${item.time}:00Z`);
    return { venue: show.venue, start, end: start + show.duration * 60000 };
  });
  for (let i = 0; i < intervals.length; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      const a = intervals[i];
      const b = intervals[j];
      if (a.venue === b.venue) {
        expect(a.end <= b.start || b.end <= a.start).toBe(true);
      }
    }
  }
});

test('booking cutoff uses Kyiv time including daylight saving', () => {
  expect(festivalNow(new Date('2026-11-21T17:00:00Z'))).toBe(
    '2026-11-21T19:00',
  );
  expect(festivalNow(new Date('2027-04-21T16:00:00Z'))).toBe(
    '2027-04-21T19:00',
  );
  const show = showPerformances(shows[0].id)[0];
  expect(isUpcoming(show, new Date('2026-11-21T16:59:00Z'))).toBe(true);
  expect(isUpcoming(show, new Date('2026-11-21T17:00:00Z'))).toBe(false);
  expect(isUpcoming(show, new Date('2027-05-01T00:00:00Z'))).toBe(false);
  expect(
    validPerformanceSnapshot({ ...show, date: '2027-02-31' }, show.showId),
  ).toBe(false);
});
