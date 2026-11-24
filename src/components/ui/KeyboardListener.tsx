import React, { useEffect } from 'react';
import { useAudio } from '../../context/AudioContext';
import { useWorkspace } from '../../context/WorkspaceContext';

export const KeyboardListener: React.FC = () => {
  const {
    togglePlay,
    nextTrack,
    prevTrack,
    volume,
    setVolume,
    toggleMute,
  } = useAudio();

  const {
    toggleFullscreenFocus,
    toggleTimer,
    resetTimer,
    showShortcutsModal,
    setShowShortcutsModal,
    isFullscreenFocus,
  } = useWorkspace();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing into an input or textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;

        case 'ArrowRight':
          e.preventDefault();
          nextTrack();
          break;

        case 'ArrowLeft':
          e.preventDefault();
          prevTrack();
          break;

        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.05));
          break;

        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.05));
          break;

        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;

        case 'KeyF':
          e.preventDefault();
          toggleFullscreenFocus();
          break;

        case 'KeyT':
          e.preventDefault();
          toggleTimer();
          break;

        case 'KeyR':
          e.preventDefault();
          resetTimer();
          break;

        case 'Slash':
          if (e.shiftKey) {
            e.preventDefault();
            setShowShortcutsModal(!showShortcutsModal);
          }
          break;

        case 'Escape':
          if (showShortcutsModal) {
            setShowShortcutsModal(false);
          } else if (isFullscreenFocus) {
            toggleFullscreenFocus();
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    togglePlay,
    nextTrack,
    prevTrack,
    volume,
    setVolume,
    toggleMute,
    toggleFullscreenFocus,
    toggleTimer,
    resetTimer,
    showShortcutsModal,
    setShowShortcutsModal,
    isFullscreenFocus,
  ]);

  return null;
};
