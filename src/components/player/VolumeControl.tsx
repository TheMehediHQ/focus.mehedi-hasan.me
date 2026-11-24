import React from 'react';
import { useAudio } from '../../context/AudioContext';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

export const VolumeControl: React.FC = () => {
  const { volume, isMuted, setVolume, toggleMute } = useAudio();

  const effectiveVolume = isMuted ? 0 : volume;

  const Icon = effectiveVolume === 0 ? VolumeX : effectiveVolume < 0.5 ? Volume1 : Volume2;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  return (
    <div className="flex items-center gap-2 select-none group">
      <button
        onClick={toggleMute}
        title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        <Icon className="w-4 h-4" />
      </button>

      <div className="w-20 sm:w-24 flex items-center">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={effectiveVolume}
          onChange={handleSliderChange}
          aria-label="Volume"
          className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-400 hover:h-1.5 transition-all"
        />
      </div>

      <span className="text-[10px] font-mono text-zinc-400 w-7 text-right hidden sm:inline-block">
        {Math.round(effectiveVolume * 100)}%
      </span>
    </div>
  );
};
