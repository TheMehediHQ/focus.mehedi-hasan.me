import React, { useState, useRef, useCallback } from 'react';
import { useAudio } from '../../context/AudioContext';

export const ProgressBar: React.FC = () => {
  const { currentTime, duration, seek } = useAudio();
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);

  const barRef = useRef<HTMLDivElement | null>(null);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getTimeFromEvent = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (!barRef.current || duration <= 0) return 0;
      const rect = barRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      return ratio * duration;
    },
    [duration]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const newTime = getTimeFromEvent(e);
    setDragTime(newTime);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const movedTime = getTimeFromEvent(moveEvent);
      setDragTime(movedTime);
    };

    const onMouseUp = (upEvent: MouseEvent) => {
      const finalTime = getTimeFromEvent(upEvent);
      seek(finalTime);
      setIsDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!barRef.current || duration <= 0) return;
    const rect = barRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(ratio * duration);
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
  };

  const displayTime = isDragging ? dragTime : currentTime;
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;

  return (
    <div className="w-full flex items-center gap-3 select-none">
      <span className="text-[11px] font-mono text-zinc-400 min-w-[42px] text-right flex-shrink-0">
        {formatTime(displayTime)}
      </span>

      {/* Progress Track */}
      <div
        ref={barRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative group flex-1 h-5 flex items-center cursor-pointer"
        role="slider"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={displayTime}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') seek(currentTime + 5);
          if (e.key === 'ArrowLeft') seek(currentTime - 5);
        }}
      >
        {/* Track bar background */}
        <div className="w-full h-1 group-hover:h-1.5 rounded-full bg-white/10 overflow-hidden transition-all duration-200">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-75 shadow-[0_0_8px_rgba(56,189,248,0.4)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Hover timestamp tooltip */}
        {hoverPosition !== null && (
          <div
            className="absolute -top-7 px-2 py-0.5 -translate-x-1/2 rounded bg-dark-850 text-[10px] font-mono text-zinc-200 border border-white/10 shadow pointer-events-none"
            style={{ left: `${(hoverPosition / duration) * 100}%` }}
          >
            {formatTime(hoverPosition)}
          </div>
        )}

        {/* Thumb indicator on hover or drag */}
        <div
          className={`absolute w-3 h-3 rounded-full bg-white shadow-md border-2 border-sky-400 transition-opacity duration-150 pointer-events-none -translate-x-1/2 ${
            isDragging ? 'opacity-100 scale-125' : 'opacity-0 group-hover:opacity-100'
          }`}
          style={{ left: `${progressPercent}%` }}
        />
      </div>

      <span className="text-[11px] font-mono text-zinc-500 min-w-[42px] text-left flex-shrink-0">
        {formatTime(duration)}
      </span>
    </div>
  );
};
