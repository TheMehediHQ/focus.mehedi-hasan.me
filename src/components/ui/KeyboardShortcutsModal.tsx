import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Keyboard, X } from 'lucide-react';

const SHORTCUTS = [
  { key: 'Space', desc: 'Play / Pause soundscape' },
  { key: '→', desc: 'Next soundscape' },
  { key: '←', desc: 'Previous soundscape' },
  { key: '↑', desc: 'Volume up (+5%)' },
  { key: '↓', desc: 'Volume down (-5%)' },
  { key: 'M', desc: 'Mute / Unmute' },
  { key: 'F', desc: 'Toggle Fullscreen Focus Mode' },
  { key: 'T', desc: 'Start / Pause Timer' },
  { key: 'R', desc: 'Reset Timer' },
  { key: '?', desc: 'View keyboard shortcuts' },
  { key: 'Esc', desc: 'Close dialog / Exit Focus Mode' },
];

export const KeyboardShortcutsModal: React.FC = () => {
  const { showShortcutsModal, setShowShortcutsModal } = useWorkspace();

  if (!showShortcutsModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={() => setShowShortcutsModal(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-dark-900 border border-white/10 p-6 shadow-2xl relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 id="shortcuts-title" className="text-base font-semibold text-white">
                Keyboard Shortcuts
              </h3>
              <p className="text-xs text-zinc-400">
                Control playback and timers without moving your mouse.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowShortcutsModal(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="py-3.5 space-y-2 max-h-[55vh] overflow-y-auto">
          {SHORTCUTS.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-white/[0.03]"
            >
              <span className="text-zinc-300 font-light">{s.desc}</span>
              <kbd className="px-2.5 py-0.5 rounded bg-white/10 text-zinc-200 font-mono text-[11px] border border-white/10 shadow-sm min-w-[28px] text-center">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={() => setShowShortcutsModal(false)}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
