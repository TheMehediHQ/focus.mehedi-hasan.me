import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import type { Track, PlaybackStatus, RepeatMode } from '../types';
import { TRACKS, getTrackById } from '../data/tracks';

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  status: PlaybackStatus;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  favorites: string[];
  playTrack: (track: Track) => Promise<void>;
  togglePlay: () => Promise<void>;
  pause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  toggleFavorite: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LAST_TRACK_ID: 'fucos_last_track_id',
  VOLUME: 'fucos_audio_volume',
  MUTED: 'fucos_audio_muted',
  REPEAT: 'fucos_repeat_mode',
  SHUFFLE: 'fucos_shuffle_mode',
  FAVORITES: 'fucos_favorite_tracks',
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Keep references for event handlers without stale closures
  const stateRef = useRef({
    currentTrack,
    repeatMode,
    isShuffle,
    volume,
    isMuted,
  });

  useEffect(() => {
    stateRef.current = {
      currentTrack,
      repeatMode,
      isShuffle,
      volume,
      isMuted,
    };
  }, [currentTrack, repeatMode, isShuffle, volume, isMuted]);

  // Initialize from LocalStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load volume
    const savedVol = localStorage.getItem(STORAGE_KEYS.VOLUME);
    if (savedVol !== null) {
      const parsed = parseFloat(savedVol);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
        setVolumeState(parsed);
      }
    }

    // Load muted state
    const savedMuted = localStorage.getItem(STORAGE_KEYS.MUTED);
    if (savedMuted !== null) {
      setIsMuted(savedMuted === 'true');
    }

    // Load repeat mode
    const savedRepeat = localStorage.getItem(STORAGE_KEYS.REPEAT) as RepeatMode | null;
    if (savedRepeat && ['off', 'all', 'one'].includes(savedRepeat)) {
      setRepeatMode(savedRepeat);
    }

    // Load shuffle mode
    const savedShuffle = localStorage.getItem(STORAGE_KEYS.SHUFFLE);
    if (savedShuffle !== null) {
      setIsShuffle(savedShuffle === 'true');
    }

    // Load favorites
    try {
      const savedFavs = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (savedFavs) {
        const parsed = JSON.parse(savedFavs);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }

    // Load last played track (paused on start, ready to play)
    const lastTrackId = localStorage.getItem(STORAGE_KEYS.LAST_TRACK_ID);
    const initialTrack = (lastTrackId && getTrackById(lastTrackId)) || TRACKS[0];
    if (initialTrack) {
      setCurrentTrack(initialTrack);
      setDuration(initialTrack.duration);
    }

    // Initialize HTML5 Audio instance
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = savedVol ? parseFloat(savedVol) : 0.8;
    audio.muted = savedMuted === 'true';
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
      setStatus('playing');
    };

    const onWaiting = () => {
      setStatus('loading');
    };

    const onCanPlay = () => {
      if (audio.paused) {
        setStatus('paused');
      } else {
        setStatus('playing');
      }
    };

    const onEnded = () => {
      const { repeatMode: rep, isShuffle: shuf, currentTrack: cur } = stateRef.current;
      if (rep === 'one') {
        // Repeat current track seamlessly
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (rep === 'all' || shuf) {
        // Auto-play next track (loops indefinitely across library)
        handleNextTrack();
      } else {
        // If repeat is off: auto-play next tracks until reaching the end of the library
        if (!cur) {
          setIsPlaying(false);
          setStatus('idle');
          return;
        }
        const currentIndex = TRACKS.findIndex((t) => t.id === cur.id);
        if (currentIndex < TRACKS.length - 1) {
          handleNextTrack();
        } else {
          setIsPlaying(false);
          setStatus('idle');
        }
      }
    };

    const onError = () => {
      setStatus('error');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Update MediaSession API for OS controls & lockscreen
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator) || !currentTrack) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.categoryName,
        artwork: [
          { src: currentTrack.artwork, sizes: '512x512', type: 'image/svg+xml' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => {
        togglePlay();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        pause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        prevTrack();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        nextTrack();
      });
    } catch {
      // Best-effort
    }
  }, [currentTrack]);

  // Sync document title
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isPlaying && currentTrack) {
      document.title = `▶ ${currentTrack.title} — focus.mehedi-hasan.me`;
    } else if (currentTrack) {
      document.title = `${currentTrack.title} — focus.mehedi-hasan.me`;
    } else {
      document.title = 'focus.mehedi-hasan.me — Deep Work & Meditation Music';
    }
  }, [isPlaying, currentTrack]);

  // Play a specific track
  const playTrack = useCallback(async (track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentTrack(track);
    setStatus('loading');
    setDuration(track.duration);

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LAST_TRACK_ID, track.id);
    }

    try {
      if (audio.src !== window.location.origin + track.audioSrc && !audio.src.endsWith(track.audioSrc)) {
        audio.src = track.audioSrc;
        audio.load();
      }

      await audio.play();
      setIsPlaying(true);
      setStatus('playing');
    } catch (err) {
      console.warn('Playback request was prevented or aborted:', err);
      setIsPlaying(false);
      setStatus('paused');
    }
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentTrack) {
      const defaultTrack = TRACKS[0];
      await playTrack(defaultTrack);
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setStatus('paused');
    } else {
      try {
        if (!audio.src || audio.src === '') {
          audio.src = currentTrack.audioSrc;
          audio.load();
        }
        await audio.play();
        setIsPlaying(true);
        setStatus('playing');
      } catch (err) {
        console.warn('Playback error:', err);
        setStatus('paused');
      }
    }
  }, [currentTrack, isPlaying, playTrack]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
    setStatus('paused');
  }, []);

  // Next Track
  const handleNextTrack = useCallback(() => {
    const { currentTrack: cur, isShuffle: shuf } = stateRef.current;
    if (!cur) return;

    let nextTrackToPlay: Track;
    if (shuf) {
      const otherTracks = TRACKS.filter((t) => t.id !== cur.id);
      const randomIndex = Math.floor(Math.random() * otherTracks.length);
      nextTrackToPlay = otherTracks[randomIndex] || TRACKS[0];
    } else {
      const currentIndex = TRACKS.findIndex((t) => t.id === cur.id);
      const nextIndex = (currentIndex + 1) % TRACKS.length;
      nextTrackToPlay = TRACKS[nextIndex];
    }

    playTrack(nextTrackToPlay);
  }, [playTrack]);

  const nextTrack = useCallback(() => {
    handleNextTrack();
  }, [handleNextTrack]);

  // Previous Track
  const prevTrack = useCallback(() => {
    const audio = audioRef.current;
    const { currentTrack: cur } = stateRef.current;
    if (!cur) return;

    // If more than 3 seconds in, restart track
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    const currentIndex = TRACKS.findIndex((t) => t.id === cur.id);
    const prevIndex = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
    playTrack(TRACKS[prevIndex]);
  }, [playTrack]);

  // Seek
  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(seconds, audio.duration || duration || 0));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  }, [duration]);

  // Set Volume
  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
      if (clamped > 0 && isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.VOLUME, clamped.toString());
    }
  }, [isMuted]);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.muted = next;
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.MUTED, next.toString());
      }
      return next;
    });
  }, []);

  // Toggle Repeat Mode
  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      let next: RepeatMode = 'all';
      if (prev === 'all') next = 'one';
      else if (prev === 'one') next = 'off';
      else next = 'all';

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.REPEAT, next);
      }
      return next;
    });
  }, []);

  // Toggle Shuffle
  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.SHUFFLE, next.toString());
      }
      return next;
    });
  }, []);

  // Favorites
  const toggleFavorite = useCallback((trackId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((trackId: string) => {
    return favorites.includes(trackId);
  }, [favorites]);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        status,
        currentTime,
        duration,
        volume,
        isMuted,
        repeatMode,
        isShuffle,
        favorites,
        playTrack,
        togglePlay,
        pause,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
        toggleMute,
        toggleRepeat,
        toggleShuffle,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
