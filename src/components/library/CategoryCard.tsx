import React from 'react';
import type { Category } from '../../types';
import { useWorkspace } from '../../context/WorkspaceContext';
import { ChevronRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onSelect: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group relative flex flex-col p-4 rounded-3xl cursor-pointer transition-all duration-300 overflow-hidden border select-none ${
        isSelected
          ? 'bg-workspace-800/80 border-sky-400/50 shadow-xl shadow-sky-500/10 -translate-y-1'
          : 'bg-workspace-900/60 hover:bg-workspace-850/80 border-white/5 hover:border-white/15'
      }`}
    >
      {/* Artwork container */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3.5 bg-black/40">
        <img
          src={category.artwork}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-zinc-300 border border-white/10">
          {category.trackCount} tracks
        </span>
      </div>

      {/* Title & Tagline */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white tracking-tight group-hover:text-sky-300 transition-colors">
          {category.name}
        </h3>
        <ChevronRight
          className={`w-4 h-4 transition-transform duration-300 ${
            isSelected ? 'rotate-90 text-sky-400' : 'text-zinc-500 group-hover:translate-x-0.5'
          }`}
        />
      </div>

      <p className="text-xs text-zinc-400 font-light mt-1 line-clamp-1">
        {category.tagline}
      </p>

      {/* Active Accent Indicator */}
      {isSelected && (
        <span
          className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full"
          aria-hidden="true"
        />
      )}
    </div>
  );
};
