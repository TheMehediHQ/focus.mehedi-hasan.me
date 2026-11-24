import React, { useMemo } from 'react';
import { CATEGORIES } from '../../data/categories';
import { TRACKS } from '../../data/tracks';
import { TrackCard } from './TrackCard';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAudio } from '../../context/AudioContext';
import { Headphones, Heart } from 'lucide-react';

export const LibrarySection: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useWorkspace();
  const { favorites } = useAudio();

  const filteredTracks = useMemo(() => {
    return TRACKS.filter((track) => {
      if (selectedCategory === 'favorites') {
        return favorites.includes(track.id);
      }
      if (selectedCategory !== 'all') {
        return track.categoryId === selectedCategory;
      }
      return true;
    });
  }, [selectedCategory, favorites]);

  return (
    <div className="flex flex-col gap-3.5">
      {/* Category filter pills bar with horizontal swipe */}
      <div className="w-full flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 -mx-1 px-1 w-full max-w-full flex-nowrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            All ({TRACKS.length})
          </button>

          <button
            onClick={() => setSelectedCategory('favorites')}
            className={`flex-shrink-0 whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedCategory === 'favorites'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Heart className={`w-3 h-3 ${favorites.length > 0 ? 'fill-current' : ''}`} />
            <span>Favorites ({favorites.length})</span>
          </button>

          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === c.id
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-mono text-zinc-500 hidden md:inline-block flex-shrink-0">
          {filteredTracks.length} {filteredTracks.length === 1 ? 'soundscape' : 'soundscapes'}
        </span>
      </div>

      {/* Sleek track list */}
      <div className="flex flex-col gap-2">
        {filteredTracks.length > 0 ? (
          filteredTracks.map((track, idx) => (
            <TrackCard key={track.id} track={track} index={idx} />
          ))
        ) : (
          <div className="p-8 text-center rounded-2xl bg-dark-900/30 border border-white/5 flex flex-col items-center justify-center">
            <Headphones className="w-6 h-6 text-zinc-600 mb-2" />
            <p className="text-xs text-zinc-400">
              {selectedCategory === 'favorites'
                ? 'No favorite tracks saved yet. Click the heart on any track to pin it here.'
                : 'No soundscapes match this filter.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
