import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import type { SceneId, CategoryId } from '../types';
import confetti from 'canvas-confetti';

export type TimerMode = 'pomodoro' | 'focus' | 'deepwork' | 'custom';

export interface TimerConfig {
  mode: TimerMode;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  completedSessions: number;
}

interface WorkspaceContextType {
  currentScene: SceneId;
  setScene: (scene: SceneId) => void;
  isFullscreenFocus: boolean;
  toggleFullscreenFocus: () => void;
  selectedCategory: CategoryId | 'all' | 'favorites';
  setSelectedCategory: (cat: CategoryId | 'all' | 'favorites') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  showShortcutsModal: boolean;
  setShowShortcutsModal: (show: boolean) => void;
  // Timer
  timer: TimerConfig;
  startTimer: () => void;
  pauseTimer: () => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  setTimerPreset: (mode: TimerMode, minutes?: number) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SCENE: 'fucos_ambient_scene',
  TIMER_PRESET: 'fucos_timer_preset',
  TIMER_CUSTOM_MINS: 'fucos_timer_custom_mins',
  COMPLETED_SESSIONS: 'fucos_completed_sessions',
};

const PRESET_DURATIONS: Record<Exclude<TimerMode, 'custom'>, number> = {
  pomodoro: 25 * 60,
  focus: 50 * 60,
  deepwork: 90 * 60,
};

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScene, setCurrentSceneState] = useState<SceneId>('rainy-window');
  const [isFullscreenFocus, setIsFullscreenFocus] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);

  // Timer State
  const [timer, setTimer] = useState<TimerConfig>({
    mode: 'pomodoro',
    totalSeconds: 25 * 60,
    remainingSeconds: 25 * 60,
    isRunning: false,
    completedSessions: 0,
  });

  const timerRef = useRef<number | null>(null);
  const completionAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load scene
    const savedScene = localStorage.getItem(STORAGE_KEYS.SCENE) as SceneId | null;
    if (savedScene && ['rainy-window', 'forest', 'ocean', 'night-sky', 'fireplace'].includes(savedScene)) {
      setCurrentSceneState(savedScene);
    }

    // Load completed sessions
    const savedSessions = localStorage.getItem(STORAGE_KEYS.COMPLETED_SESSIONS);
    const completedSessions = savedSessions ? parseInt(savedSessions, 10) || 0 : 0;

    // Load preset
    const savedPreset = localStorage.getItem(STORAGE_KEYS.TIMER_PRESET) as TimerMode | null;
    const customMins = parseInt(localStorage.getItem(STORAGE_KEYS.TIMER_CUSTOM_MINS) || '30', 10);

    let initialSeconds = 25 * 60;
    let initialMode: TimerMode = 'pomodoro';

    if (savedPreset === 'custom') {
      initialMode = 'custom';
      initialSeconds = customMins * 60;
    } else if (savedPreset && savedPreset in PRESET_DURATIONS) {
      initialMode = savedPreset;
      initialSeconds = PRESET_DURATIONS[savedPreset];
    }

    setTimer({
      mode: initialMode,
      totalSeconds: initialSeconds,
      remainingSeconds: initialSeconds,
      isRunning: false,
      completedSessions,
    });

    // Preload completion sound
    completionAudioRef.current = new Audio('/music/session-complete.mp3');
    completionAudioRef.current.preload = 'auto';

    // Sync fullscreen change events (e.g. user pressing Esc)
    const onFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreenFocus(isFull);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  // Save scene changes
  const setScene = useCallback((scene: SceneId) => {
    setCurrentSceneState(scene);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SCENE, scene);
    }
  }, []);

  // Toggle fullscreen
  const toggleFullscreenFocus = useCallback(() => {
    if (typeof document === 'undefined') return;

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreenFocus(true);
      }).catch(() => {
        // Fallback for browsers that block native fullscreen
        setIsFullscreenFocus((prev) => !prev);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreenFocus(false);
      }).catch(() => {
        setIsFullscreenFocus(false);
      });
    }
  }, []);

  // Play celebration and audio chime upon session completion
  const triggerSessionCompletion = useCallback(() => {
    // 1. Play calming bell
    if (completionAudioRef.current) {
      completionAudioRef.current.currentTime = 0;
      completionAudioRef.current.play().catch(() => {});
    }

    // 2. Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#34d399', '#f59e0b', '#c084fc'],
      });
    } catch {
      // Ignore if canvas not supported
    }

    // 3. Desktop notification if allowed
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('focus.mehedi-hasan.me — Focus Session Complete', {
          body: 'Splendid focus! Take a deep mindful breath and stretch.',
          icon: '/images/artwork/deep-focus.svg',
        });
      } catch {
        // Best-effort
      }
    }

    // 4. Increment completed sessions
    setTimer((prev) => {
      const nextCount = prev.completedSessions + 1;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.COMPLETED_SESSIONS, nextCount.toString());
      }
      return {
        ...prev,
        isRunning: false,
        remainingSeconds: prev.totalSeconds,
        completedSessions: nextCount,
      };
    });
  }, []);

  // Timer tick effect
  useEffect(() => {
    if (timer.isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimer((prev) => {
          if (prev.remainingSeconds <= 1) {
            clearInterval(timerRef.current!);
            triggerSessionCompletion();
            return {
              ...prev,
              remainingSeconds: 0,
              isRunning: false,
            };
          }
          return {
            ...prev,
            remainingSeconds: prev.remainingSeconds - 1,
          };
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timer.isRunning, triggerSessionCompletion]);

  // Timer controls
  const startTimer = useCallback(() => {
    // Request notification permission if default
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
    setTimer((prev) => ({ ...prev, isRunning: true }));
  }, []);

  const pauseTimer = useCallback(() => {
    setTimer((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const toggleTimer = useCallback(() => {
    setTimer((prev) => {
      if (!prev.isRunning && prev.remainingSeconds === 0) {
        return {
          ...prev,
          remainingSeconds: prev.totalSeconds,
          isRunning: true,
        };
      }
      return {
        ...prev,
        isRunning: !prev.isRunning,
      };
    });
  }, []);

  const resetTimer = useCallback(() => {
    setTimer((prev) => ({
      ...prev,
      isRunning: false,
      remainingSeconds: prev.totalSeconds,
    }));
  }, []);

  const setTimerPreset = useCallback((mode: TimerMode, customMins?: number) => {
    let seconds = 25 * 60;
    if (mode === 'custom' && customMins) {
      seconds = customMins * 60;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.TIMER_CUSTOM_MINS, customMins.toString());
      }
    } else if (mode in PRESET_DURATIONS) {
      seconds = PRESET_DURATIONS[mode as Exclude<TimerMode, 'custom'>];
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TIMER_PRESET, mode);
    }

    setTimer((prev) => ({
      ...prev,
      mode,
      totalSeconds: seconds,
      remainingSeconds: seconds,
      isRunning: false,
    }));
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        currentScene,
        setScene,
        isFullscreenFocus,
        toggleFullscreenFocus,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        showShortcutsModal,
        setShowShortcutsModal,
        timer,
        startTimer,
        pauseTimer,
        toggleTimer,
        resetTimer,
        setTimerPreset,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
