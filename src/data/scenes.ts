import type { AmbientScene } from '../types';

export const AMBIENT_SCENES: AmbientScene[] = [
  {
    id: 'rainy-window',
    name: 'Rainy Window',
    tagline: 'Drizzle trickling on glass',
    iconName: 'CloudRain',
    bgSvg: '/images/backgrounds/rainy-window.svg',
    tintColor: '#38bdf8',
    effect: 'rain',
  },
  {
    id: 'forest',
    name: 'Forest Mist',
    tagline: 'Canopy light & quiet pines',
    iconName: 'Trees',
    bgSvg: '/images/backgrounds/forest.svg',
    tintColor: '#10b981',
    effect: 'forest',
  },
  {
    id: 'ocean',
    name: 'Ocean Shore',
    tagline: 'Twilight horizon & rhythmic tides',
    iconName: 'Waves',
    bgSvg: '/images/backgrounds/ocean.svg',
    tintColor: '#0284c7',
    effect: 'ocean',
  },
  {
    id: 'night-sky',
    name: 'Night Sky',
    tagline: 'Cosmic nebula & distant stars',
    iconName: 'Moon',
    bgSvg: '/images/backgrounds/night-sky.svg',
    tintColor: '#818cf8',
    effect: 'stars',
  },
  {
    id: 'fireplace',
    name: 'Cozy Hearth',
    tagline: 'Crackling embers & flame glow',
    iconName: 'Flame',
    bgSvg: '/images/backgrounds/fireplace.svg',
    tintColor: '#f97316',
    effect: 'fire',
  },
];
