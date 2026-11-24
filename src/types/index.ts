export type CategoryId = 
  | 'deep-focus'
  | 'meditation'
  | 'rain'
  | 'nature'
  | 'ocean'
  | 'piano'
  | 'sleep';

export type SceneId = 
  | 'rainy-window'
  | 'forest'
  | 'ocean'
  | 'night-sky'
  | 'fireplace';

export interface Track {
  id: string;
  title: string;
  artist: string;
  categoryId: CategoryId;
  categoryName: string;
  audioSrc: string;
  artwork: string;
  duration: number; // in seconds
  frequency?: string; // e.g. "10Hz Alpha", "432Hz Om"
  description: string;
  tags: string[];
}

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  description: string;
  artwork: string;
  accentColor: string;
  glowColor: string;
  trackCount: number;
}

export interface AmbientScene {
  id: SceneId;
  name: string;
  tagline: string;
  iconName: string;
  bgSvg: string;
  tintColor: string;
  effect: 'rain' | 'forest' | 'ocean' | 'stars' | 'fire';
}

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';
export type RepeatMode = 'off' | 'all' | 'one';

export interface TimerState {
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  mode: 'pomodoro' | 'focus' | 'deepwork' | 'custom';
  completedSessions: number;
}
