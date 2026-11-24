import React from 'react';
import { AudioProvider } from '../context/AudioContext';
import { WorkspaceProvider, useWorkspace } from '../context/WorkspaceContext';
import { AmbientCanvas } from './ambient/AmbientCanvas';
import { WelcomeHeader } from './dashboard/WelcomeHeader';
import { FocusTimer } from './timer/FocusTimer';
import { LibrarySection } from './library/LibrarySection';
import { MusicPlayer } from './player/MusicPlayer';
import { FullscreenFocusMode } from './focus/FullscreenFocusMode';
import { KeyboardShortcutsModal } from './ui/KeyboardShortcutsModal';
import { KeyboardListener } from './ui/KeyboardListener';
import { AMBIENT_SCENES } from '../data/scenes';
import { Maximize2, Headphones, HelpCircle } from 'lucide-react';

const WorkspaceContent: React.FC = () => {
  const { currentScene, toggleFullscreenFocus, setShowShortcutsModal } = useWorkspace();

  const sceneConfig = AMBIENT_SCENES.find((s) => s.id === currentScene) || AMBIENT_SCENES[0];

  return (
    <div className="relative min-h-screen w-full bg-dark-950 text-zinc-100 flex flex-col selection:bg-sky-500/30 selection:text-white">
      {/* Dynamic Ambient Background Image with Crossfade */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none transition-all duration-1000 opacity-20 scale-105"
        style={{ backgroundImage: `url(${sceneConfig.bgSvg})` }}
        aria-hidden="true"
      />
      {/* Modern gradient glow vignette */}
      <div
        className="fixed inset-0 z-0 bg-modern-glow pointer-events-none"
        aria-hidden="true"
      />

      {/* Ambient Procedural Particle Canvas */}
      <AmbientCanvas />

      {/* Global Keyboard Listener */}
      <KeyboardListener />

      {/* Fullscreen Focus Mode Overlay */}
      <FullscreenFocusMode />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal />

      {/* Top Modern Header Navigation */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-3.5 border-b border-white/[0.06] backdrop-blur-md bg-dark-950/60 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <a href="/" className="flex items-center gap-2.5 group select-none">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 via-sky-500 to-indigo-500 flex items-center justify-center shadow-md shadow-sky-500/20 text-dark-950 transition-transform group-hover:scale-105">
              <Headphones className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="flex items-baseline font-mono">
              <span className="text-sm sm:text-base font-semibold tracking-tight text-white group-hover:text-sky-300 transition-colors">
                focus<span className="text-sky-400 font-bold">.</span>mehedi-hasan<span className="text-sky-400 font-bold">.</span>me
              </span>
            </div>
          </a>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShortcutsModal(true)}
              title="Keyboard Shortcuts (?)"
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-xs font-mono"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              onClick={toggleFullscreenFocus}
              title="Enter Fullscreen Focus Mode (F)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 hover:text-white border border-white/10 text-xs font-medium transition-all shadow-sm active:scale-95"
            >
              <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline-block">Focus Mode</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col gap-6 pb-32">
        {/* 1. Header with Clock & Greeting */}
        <WelcomeHeader />

        {/* 2. Main Two-Panel Focus Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Focus Timer */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <FocusTimer />
          </div>

          {/* Right Column: Soundscape Library (The 6 Master Tracks) */}
          <div className="lg:col-span-7 flex flex-col gap-4 p-5 sm:p-6 rounded-3xl bg-dark-900/60 border border-white/[0.08] backdrop-blur-2xl shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Soundscape Library
                </h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                6 Master Tracks
              </span>
            </div>
            <LibrarySection />
          </div>
        </div>
      </main>

      {/* Persistent Bottom Music Player */}
      <MusicPlayer />
    </div>
  );
};

export const WorkspaceApp: React.FC = () => {
  return (
    <AudioProvider>
      <WorkspaceProvider>
        <WorkspaceContent />
      </WorkspaceProvider>
    </AudioProvider>
  );
};
