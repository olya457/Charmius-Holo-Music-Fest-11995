import data from './catalog.json';
import { CatalogItem, Location, Show, Technology } from '../types/models';
export const shows = data.shows as Show[];
export const exhibits = data.exhibits as CatalogItem[];
export const locations = data.locations as Location[];
export const technologies = data.technologies as Technology[];
export const findLocation = (title: string) =>
  locations.find(item => item.title === title);
