import type { Category } from '../types';
import { TRACKS } from './tracks';

const BASE_CATEGORIES: Omit<Category, 'trackCount'>[] = [
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    tagline: 'Flow state & cognitive expansion',
    description: 'Expansive acoustic frequencies designed to eliminate mental friction.',
    artwork: '/images/artwork/deep-focus.svg',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.25)',
  },
  {
    id: 'meditation',
    name: 'Meditation',
    tagline: 'Stillness, awareness & breath',
    description: 'Profound spiritual soundscapes, sacred 432Hz/528Hz healing, and mindful peace.',
    artwork: '/images/artwork/meditation.svg',
    accentColor: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.25)',
  },
  {
    id: 'rain',
    name: 'Rain Sounds',
    tagline: 'Gentle downpours & cloud melodies',
    description: 'Crisp raindrops, wet breezes, and soothing atmospheric cloud melodies.',
    artwork: '/images/artwork/rain.svg',
    accentColor: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.25)',
  },
  {
    id: 'nature',
    name: 'Nature & Forest',
    tagline: 'Living woodland soundscapes',
    description: 'Echoes of pristine nature, ancient forest tranquility, and peaceful greenery.',
    artwork: '/images/artwork/nature.svg',
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.25)',
  },
  {
    id: 'piano',
    name: 'Piano & Ambient',
    tagline: 'Minimalist emotive keys & light',
    description: 'Luminous ambient piano chords and restful harmonies for quiet contemplation.',
    artwork: '/images/artwork/piano.svg',
    accentColor: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.25)',
  },
];

export const CATEGORIES: Category[] = BASE_CATEGORIES.map((cat) => ({
  ...cat,
  trackCount: TRACKS.filter((t) => t.categoryId === cat.id).length,
}));
