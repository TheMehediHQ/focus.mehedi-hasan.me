import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { AMBIENT_SCENES } from '../../data/scenes';
import { CloudRain, Trees, Waves, Moon, Flame } from 'lucide-react';

const ICON_MAP = {
  CloudRain,
  Trees,
  Waves,
  Moon,
  Flame,
};

export const AmbientSceneSelector: React.FC = () => {
  const { currentScene, setScene } = useWorkspace();

  return (
    <div className="flex items-center gap-1 p-1 rounded-2xl bg-vintage-900/80 backdrop-blur-xl border border-vintage-brass/20 shadow-2xl">
      {AMBIENT_SCENES.map((scene) => {
        const Icon = ICON_MAP[scene.iconName as keyof typeof ICON_MAP] || CloudRain;
        const isActive = currentScene === scene.id;

        return (
          <button
            key={scene.id}
            onClick={() => setScene(scene.id)}
            title={`${scene.name}: ${scene.tagline}`}
            className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-serif tracking-wide transition-all duration-300 ${
              isActive
                ? 'bg-vintage-800 text-vintage-100 shadow-lg border border-vintage-brass/40 shadow-black/50'
                : 'text-vintage-400 hover:text-vintage-200 hover:bg-vintage-800/40 border border-transparent'
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110 ${
                isActive ? 'text-vintage-amber' : 'text-vintage-400'
              }`}
            />
            <span className="hidden sm:inline-block">{scene.name}</span>
            {isActive && (
              <span
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-0.5 rounded-full bg-vintage-amber shadow-[0_0_8px_#e6983b]"
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
