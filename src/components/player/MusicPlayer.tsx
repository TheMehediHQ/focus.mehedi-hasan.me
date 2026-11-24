import React from 'react';
import { useAudio } from '../../context/AudioContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Maximize2,
  HelpCircle,
  Loader2,
} from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    status,
    togglePlay,
    nextTrack,
    prevTrack,
    repeatMode,
    toggleRepeat,
    isShuffle,
    toggleShuffle,
    isFavorite,
    toggleFavorite,
  } = useAudio();

  const { toggleFullscreenFocus, setShowShortcutsModal } = useWorkspace();

  if (!currentTrack) return null;

  const favorited = isFavorite(currentTrack.id);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-dark-950/90 backdrop-blur-2xl border-t border-white/[0.08] px-3.5 sm:px-8 py-2 sm:py-3 pb-safe shadow-[0_-10px_35px_rgba(0,0,0,0.7)]">
      <div className="max-w-6xl mx-auto w-full">
        {/* Mobile View: Compact modern floating bar */}
        <div className="flex md:hidden flex-col w-full gap-1.5">
          {/* Top row: Artwork + Info + Quick Controls */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-black/60 border border-white/10 shadow-sm">
                <img
                  src={currentTrack.artwork}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-sky-950/40 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                  </div>
                )}
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <h4 className="text-xs font-medium text-white truncate drop-shadow-sm">
                  {currentTrack.title}
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 truncate mt-0.5">
                  <span className="text-sky-400 font-medium truncate">
                    {currentTrack.categoryName}
                  </span>
                  <span>•</span>
                  <span className="truncate">{currentTrack.artist}</span>
                </div>
              </div>
            </div>

            {/* Quick action controls for mobile */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => toggleFavorite(currentTrack.id)}
                title={favorited ? 'Remove from favorites' : 'Add to favorites'}
                aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    favorited ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
              </button>

              <button
                onClick={prevTrack}
                title="Previous track"
                aria-label="Previous track"
                className="p-1.5 text-zinc-300 hover:text-white transition-all active:scale-95"
              >
                <SkipBack className="w-3.5 h-3.5 fill-current" />
              </button>

              <button
                onClick={togglePlay}
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="p-2 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-dark-950 shadow-md shadow-sky-500/25 active:scale-95 transition-all"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-dark-950" />
                ) : isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current text-dark-950" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current text-dark-950 ml-0.5" />
                )}
              </button>

              <button
                onClick={nextTrack}
                title="Next track"
                aria-label="Next track"
                className="p-1.5 text-zinc-300 hover:text-white transition-all active:scale-95"
              >
                <SkipForward className="w-3.5 h-3.5 fill-current" />
              </button>

              <button
                onClick={toggleFullscreenFocus}
                title="Fullscreen Focus Mode"
                aria-label="Fullscreen Focus Mode"
                className="p-1.5 text-sky-400 hover:text-white transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom row: Scrubber */}
          <ProgressBar />
        </div>

        {/* Desktop View (md and up): Full 3-column dock */}
        <div className="hidden md:flex items-center justify-between gap-6">
          {/* Left: Track Information */}
          <div className="flex items-center gap-3.5 w-1/4 min-w-0">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-black/60 border border-white/10 shadow-md">
              <img
                src={currentTrack.artwork}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-sky-950/40 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                </div>
              )}
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-medium text-white truncate drop-shadow-sm">
                  {currentTrack.title}
                </h4>
                <button
                  onClick={() => toggleFavorite(currentTrack.id)}
                  title={favorited ? 'Remove from favorites' : 'Add to favorites'}
                  aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                  className="flex-shrink-0 p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      favorited ? 'fill-rose-500 text-rose-500' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                <span className="truncate">{currentTrack.artist}</span>
                <span>•</span>
                <span className="text-sky-400 text-[11px] font-medium">
                  {currentTrack.categoryName}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Controls & Progress */}
          <div className="flex flex-col items-center gap-2 w-2/4 max-w-xl">
            {/* Main Button Row */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Shuffle */}
              <button
                onClick={toggleShuffle}
                title={isShuffle ? 'Shuffle active' : 'Shuffle off'}
                aria-label={isShuffle ? 'Shuffle active' : 'Shuffle off'}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  isShuffle
                    ? 'text-sky-400 bg-sky-500/10'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>

              {/* Previous */}
              <button
                onClick={prevTrack}
                title="Previous soundscape (←)"
                aria-label="Previous soundscape"
                className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-all active:scale-95"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>

              {/* Play / Pause Button with Modern Glow */}
              <button
                onClick={togglePlay}
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="p-3.5 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-dark-950 shadow-lg shadow-sky-500/25 active:scale-95 transition-all duration-200"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-dark-950" />
                ) : isPlaying ? (
                  <Pause className="w-4 h-4 fill-current text-dark-950" />
                ) : (
                  <Play className="w-4 h-4 fill-current text-dark-950 ml-0.5" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={nextTrack}
                title="Next soundscape (→)"
                aria-label="Next soundscape"
                className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-all active:scale-95"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>

              {/* Repeat Mode */}
              <button
                onClick={toggleRepeat}
                title={`Repeat: ${repeatMode}`}
                aria-label={`Repeat: ${repeatMode}`}
                className={`relative p-2 rounded-xl transition-all duration-200 ${
                  repeatMode !== 'off'
                    ? 'text-sky-400 bg-sky-500/10'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {repeatMode === 'one' ? (
                  <Repeat1 className="w-3.5 h-3.5" />
                ) : (
                  <Repeat className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Progress Bar */}
            <ProgressBar />
          </div>

          {/* Right: Volume & Utilities */}
          <div className="flex items-center justify-end gap-3 w-1/4">
            <VolumeControl />

            <div className="h-5 w-[1px] bg-white/10 hidden sm:block" />

            {/* Shortcuts Modal Trigger */}
            <button
              onClick={() => setShowShortcutsModal(true)}
              title="Shortcuts (?)"
              aria-label="Keyboard Shortcuts"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors hidden sm:block"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Fullscreen Focus Mode Trigger */}
            <button
              onClick={toggleFullscreenFocus}
              title="Fullscreen Focus Mode (F)"
              aria-label="Enter Fullscreen Focus Mode"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 transition-all shadow-sm"
            >
              <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden lg:inline-block">Focus Mode</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
