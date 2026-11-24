import React from 'react';
import type { Track } from '../../types';
import { useAudio } from '../../context/AudioContext';
import { Play, Pause, Heart } from 'lucide-react';

interface TrackCardProps {
  track: Track;
  index: number;
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, index }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay, isFavorite, toggleFavorite } = useAudio();

  const isCurrent = currentTrack?.id === track.id;
  const isThisPlaying = isCurrent && isPlaying;
  const favorited = isFavorite(track.id);

  const handleCardClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  const formatDuration = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    if (h > 0) {
      return `${h}h ${m}m`;
    }
    return `${m}m`;
  };

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleCardClick();
      }}
      className={`group relative flex items-center justify-between p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-200 border select-none ${
        isCurrent
          ? 'bg-sky-500/[0.08] border-sky-400/40 shadow-lg shadow-sky-500/10'
          : 'bg-dark-900/40 hover:bg-dark-850/80 border-white/[0.05] hover:border-white/10'
      }`}
    >
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
        {/* Track Artwork with Play Indicator */}
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 bg-black/50 border border-white/5 flex items-center justify-center">
          <img
            src={track.artwork}
            alt={track.title}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isThisPlaying ? 'scale-105' : 'group-hover:scale-105'
            }`}
            loading="lazy"
          />
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all ${
              isCurrent ? 'bg-sky-950/70 opacity-100' : 'bg-black/40 opacity-0 group-hover:opacity-100'
            }`}
          >
            {isThisPlaying ? (
              <div className="flex items-end gap-0.5 h-3.5">
                <span className="w-0.5 h-2.5 bg-sky-400 animate-pulse" />
                <span className="w-0.5 h-3.5 bg-sky-400 animate-pulse delay-75" />
                <span className="w-0.5 h-2 bg-sky-400 animate-pulse delay-150" />
              </div>
            ) : (
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white ml-0.5" />
            )}
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="flex flex-col min-w-0 pr-1.5 sm:pr-2">
          <div className="flex items-center gap-2">
            <h4
              className={`text-xs sm:text-sm font-medium tracking-tight truncate ${
                isCurrent ? 'text-sky-300 font-semibold' : 'text-zinc-200 group-hover:text-white'
              }`}
            >
              {track.title}
            </h4>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 truncate">
            <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-300 text-[10px] font-mono border border-white/5 flex-shrink-0">
              {track.categoryName}
            </span>
            {track.frequency && (
              <span className="text-zinc-400 text-xs hidden sm:inline-block truncate">
                • {track.frequency}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Duration & Favorite */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
        <span className="font-mono text-[11px] sm:text-xs text-zinc-400">
          {formatDuration(track.duration)}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(track.id);
          }}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
            favorited
              ? 'text-rose-400 bg-rose-500/10'
              : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/5'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
};
