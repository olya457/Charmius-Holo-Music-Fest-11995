import type { Performance } from '../data/schedule';
export type CatalogItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  body: string;
  image: string;
  meta: Record<string, string | undefined>;
};
export type Show = CatalogItem & {
  venue: string;
  time: string;
  duration: number;
};
export type Location = CatalogItem & { group: string; x: number; y: number };
export type Technology = CatalogItem & { how: string; facts: string };
export type Booking = {
  id: string;
  showId: string;
  guests: number;
  createdAt: string;
  performance?: Performance;
};
export type DetailKind = 'show' | 'exhibit' | 'location' | 'technology';
