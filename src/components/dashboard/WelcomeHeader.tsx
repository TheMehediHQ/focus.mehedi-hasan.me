import React, { useMemo } from 'react';
import { LiveClock } from './LiveClock';
import { DailyQuote } from './DailyQuote';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAudio } from '../../context/AudioContext';
import { Play, Pause, Zap } from 'lucide-react';

export const WelcomeHeader: React.FC = () => {
  const { timer, startTimer, pauseTimer } = useWorkspace();
  const { isPlaying, togglePlay } = useAudio();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 22) return 'Good evening';
    return 'Deep night';
  }, []);

  const handleStartSession = async () => {
    if (!timer.isRunning) {
      startTimer();
    }
    if (!isPlaying) {
      await togglePlay();
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-1">
      {/* Left: Greeting & Clock */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <LiveClock />

        <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />

        <div className="flex flex-col">
          <h2 className="text-xl sm:text-2xl font-light tracking-tight text-white">
            {greeting}, <span className="font-medium text-zinc-200">flow space</span>.
          </h2>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            Distraction-free focus soundscapes & deep work chronometer.
          </p>
        </div>
      </div>

      {/* Right: Quote & Action button */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:block">
          <DailyQuote />
        </div>

        <button
          onClick={timer.isRunning ? pauseTimer : handleStartSession}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-200 select-none shadow-md ${
            timer.isRunning
              ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30'
              : 'bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-dark-950 shadow-sky-500/20 hover:shadow-sky-500/30 active:scale-95'
          }`}
        >
          {timer.isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause Focus</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Start Focus</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
