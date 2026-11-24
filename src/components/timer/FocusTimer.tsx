import React, { useState } from 'react';
import { useWorkspace, type TimerMode } from '../../context/WorkspaceContext';
import { Play, Pause, RotateCcw, Plus, Clock, Sparkles } from 'lucide-react';

export const FocusTimer: React.FC = () => {
  const {
    timer,
    toggleTimer,
    resetTimer,
    setTimerPreset,
  } = useWorkspace();

  const [customInput, setCustomInput] = useState<string>('30');
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);

  const minutes = Math.floor(timer.remainingSeconds / 60);
  const seconds = timer.remainingSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const radius = 74;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = timer.totalSeconds > 0 ? timer.remainingSeconds / timer.totalSeconds : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const presets: { id: TimerMode; label: string; mins: number }[] = [
    { id: 'pomodoro', label: '25m', mins: 25 },
    { id: 'focus', label: '50m', mins: 50 },
    { id: 'deepwork', label: '90m', mins: 90 },
  ];

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customInput, 10);
    if (!isNaN(val) && val > 0 && val <= 360) {
      setTimerPreset('custom', val);
      setShowCustomModal(false);
    }
  };

  const addFiveMinutes = () => {
    setTimerPreset('custom', Math.round((timer.remainingSeconds + 300) / 60));
  };

  return (
    <div className="relative rounded-3xl p-4 sm:p-7 bg-dark-900/60 border border-white/[0.08] backdrop-blur-2xl shadow-2xl flex flex-col items-center">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-semibold tracking-wider uppercase text-zinc-300">
            Focus Timer
          </h3>
        </div>
        {timer.completedSessions > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{timer.completedSessions} completed</span>
          </div>
        )}
      </div>

      {/* Preset Selector Tabs */}
      <div className="flex items-center justify-center gap-1 sm:gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/5 w-full max-w-xs mb-4 sm:mb-5">
        {presets.map((p) => {
          const isActive = timer.mode === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setTimerPreset(p.id)}
              className={`flex-1 py-1.5 px-2 sm:px-3 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              {p.label}
            </button>
          );
        })}

        <button
          onClick={() => setShowCustomModal((prev) => !prev)}
          className={`flex-1 py-1.5 px-2 sm:px-3 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap ${
            timer.mode === 'custom'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
          }`}
        >
          {timer.mode === 'custom' ? `${Math.round(timer.totalSeconds / 60)}m` : 'Custom'}
        </button>
      </div>

      {/* Custom Duration Input Popover */}
      {showCustomModal && (
        <form
          onSubmit={handleApplyCustom}
          className="mb-4 p-3 rounded-2xl bg-dark-850 border border-white/10 shadow-xl flex items-center gap-2.5 w-full max-w-xs animate-fade-in"
        >
          <input
            id="custom-mins"
            type="number"
            min="1"
            max="360"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="w-20 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-sky-400"
            autoFocus
            placeholder="Min"
          />
          <button
            type="submit"
            className="px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-dark-950 font-semibold text-xs transition-colors"
          >
            Set
          </button>
          <button
            type="button"
            onClick={() => setShowCustomModal(false)}
            className="px-2 py-1 text-xs text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </form>
      )}

      {/* Circular Progress Display */}
      <div className="relative flex items-center justify-center my-1">
        <svg
          className="w-44 h-44 sm:w-52 sm:h-52 -rotate-90 transform"
          viewBox="0 0 180 180"
          aria-hidden="true"
        >
          <circle
            cx="90"
            cy="90"
            r={radius}
            className="stroke-white/[0.05]"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            className={`transition-[stroke-dashoffset] duration-1000 ease-linear ${
              timer.isRunning ? 'stroke-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.5)]' : 'stroke-zinc-600'
            }`}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="font-mono text-3xl sm:text-5xl font-light tracking-tight text-white drop-shadow">
            {formattedTime}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium mt-1.5">
            {timer.isRunning ? 'Focusing...' : timer.remainingSeconds === 0 ? 'Complete' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3 mt-4 sm:mt-5">
        <button
          onClick={resetTimer}
          title="Reset timer (R)"
          className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/5 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={toggleTimer}
          title={timer.isRunning ? 'Pause timer (T)' : 'Start timer (T)'}
          className={`px-5 sm:px-7 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2 transition-all duration-300 shadow-lg ${
            timer.isRunning
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 shadow-amber-500/10'
              : 'bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-dark-950 font-semibold shadow-sky-500/20 active:scale-95'
          }`}
        >
          {timer.isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start</span>
            </>
          )}
        </button>

        <button
          onClick={addFiveMinutes}
          title="Add 5 minutes"
          className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/5 transition-all text-xs font-mono"
        >
          <span className="flex items-center gap-0.5">
            <Plus className="w-3.5 h-3.5" />
            <span>5m</span>
          </span>
        </button>
      </div>
    </div>
  );
};
