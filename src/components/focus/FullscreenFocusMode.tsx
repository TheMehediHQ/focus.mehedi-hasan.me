import React, { useEffect, useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAudio } from '../../context/AudioContext';
import {
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Heart,
} from 'lucide-react';

export const FullscreenFocusMode: React.FC = () => {
  const {
    isFullscreenFocus,
    toggleFullscreenFocus,
    timer,
    toggleTimer,
    resetTimer,
  } = useWorkspace();

  const {
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    currentTime,
    duration,
    seek,
    isFavorite,
    toggleFavorite,
  } = useAudio();

  const [mouseActive, setMouseActive] = useState(true);

  // Auto-hide controls on mouse inactivity in fullscreen
  useEffect(() => {
    if (!isFullscreenFocus) return;

    let timeout: number;
    const onMouseMove = () => {
      setMouseActive(true);
      clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        setMouseActive(false);
      }, 4000);
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      clearTimeout(timeout);
    };
  }, [isFullscreenFocus]);

  if (!isFullscreenFocus) return null;

  const minutes = Math.floor(timer.remainingSeconds / 60);
  const seconds = timer.remainingSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = timer.totalSeconds > 0 ? timer.remainingSeconds / timer.totalSeconds : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const favorited = currentTrack ? isFavorite(currentTrack.id) : false;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden bg-dark-950/90 backdrop-blur-md animate-fade-in font-sans">
      {/* Top Bar */}
      <div
        className={`w-full flex items-center justify-between transition-opacity duration-500 ${
          mouseActive ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
          <span className="text-xs uppercase tracking-widest text-zinc-300 font-semibold font-mono">
            Focus Mode
          </span>
        </div>

        {/* Exit Fullscreen */}
        <button
          onClick={toggleFullscreenFocus}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/10 transition-all shadow-lg backdrop-blur-xl"
        >
          <Minimize2 className="w-3.5 h-3.5 text-sky-400" />
          <span>Exit (ESC)</span>
        </button>
      </div>

      {/* Center Hero: Giant Modern Countdown */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div className="relative flex items-center justify-center">
          <svg
            className="w-80 h-80 sm:w-96 sm:h-96 -rotate-90 transform"
            viewBox="0 0 280 280"
            aria-hidden="true"
          >
            {/* Background Track */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              className="stroke-white/[0.05]"
              strokeWidth="5"
              fill="transparent"
            />
            {/* Glowing Active Sweep */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              className={`transition-[stroke-dashoffset] duration-1000 ease-linear ${
                timer.isRunning
                  ? 'stroke-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.5)]'
                  : 'stroke-zinc-600'
              }`}
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="font-mono text-6xl sm:text-7xl font-extralight tracking-tight text-white drop-shadow-lg">
              {formattedTime}
            </span>
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium mt-3">
              {timer.isRunning ? 'Deep Concentration' : 'Session Paused'}
            </span>

            {/* Quick Play/Pause Timer Button */}
            <div
              className={`flex items-center gap-3 mt-6 transition-opacity duration-300 ${
                mouseActive ? 'opacity-100' : 'opacity-20 hover:opacity-100'
              }`}
            >
              <button
                onClick={resetTimer}
                title="Reset timer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white border border-white/5 transition-all shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={toggleTimer}
                className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-dark-950 font-semibold text-xs tracking-wider transition-all shadow-lg shadow-sky-500/20"
              >
                {timer.isRunning ? 'PAUSE' : 'RESUME'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Zen Audio Bar */}
      {currentTrack && (
        <div
          className={`max-w-2xl mx-auto w-full p-4 rounded-3xl bg-dark-900/85 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col gap-3 transition-opacity duration-500 ${
            mouseActive ? 'opacity-100' : 'opacity-0 sm:opacity-40 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Left track info */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={currentTrack.artwork}
                alt={currentTrack.title}
                className="w-10 h-10 rounded-xl object-cover bg-black/40 border border-white/10"
              />
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-medium text-white truncate">
                  {currentTrack.title}
                </h4>
                <p className="text-[11px] text-zinc-400 truncate">
                  {currentTrack.categoryName}
                </p>
              </div>
            </div>

            {/* Center controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={prevTrack}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={togglePlay}
                className="p-2.5 rounded-xl bg-white text-dark-950 hover:bg-sky-400 transition-colors shadow-md"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={() => toggleFavorite(currentTrack.id)}
                className={`p-2 transition-colors ${
                  favorited ? 'text-rose-400' : 'text-zinc-500 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              seek(ratio * duration);
            }}
            className="w-full h-1 bg-white/10 rounded-full cursor-pointer overflow-hidden"
          >
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
