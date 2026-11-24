import React, { useEffect, useRef } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  color: string;
  length?: number;
}

export const AmbientCanvas: React.FC = () => {
  const { currentScene } = useWorkspace();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', onResize);

    const particles: Particle[] = [];
    const maxParticles = currentScene === 'rainy-window' ? 110 :
                         currentScene === 'forest' ? 40 :
                         currentScene === 'night-sky' ? 70 :
                         currentScene === 'fireplace' ? 55 : 30;

    const createParticle = (init = false): Particle => {
      const yPos = init ? Math.random() * height : -20;

      switch (currentScene) {
        case 'rainy-window':
          return {
            x: Math.random() * width,
            y: yPos,
            vx: -0.6 - Math.random() * 0.3,
            vy: 8 + Math.random() * 7,
            size: 1 + Math.random() * 1.5,
            length: 12 + Math.random() * 18,
            alpha: 0.15 + Math.random() * 0.3,
            maxAlpha: 0.45,
            life: 0,
            maxLife: 200,
            color: '#38bdf8', // crisp modern sky blue
          };
        case 'forest':
          return {
            x: Math.random() * width,
            y: init ? Math.random() * height : height + 10,
            vx: Math.sin(Math.random() * Math.PI) * 0.5 - 0.25,
            vy: -0.3 - Math.random() * 0.7,
            size: 1.5 + Math.random() * 2.5,
            alpha: 0.1 + Math.random() * 0.3,
            maxAlpha: 0.45,
            life: 0,
            maxLife: 400 + Math.random() * 200,
            color: Math.random() > 0.4 ? '#34d399' : '#10b981',
          };
        case 'night-sky':
          return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.08,
            vy: (Math.random() - 0.5) * 0.08,
            size: 0.8 + Math.random() * 2.0,
            alpha: 0.2 + Math.random() * 0.7,
            maxAlpha: 0.85,
            life: Math.random() * 200,
            maxLife: 150 + Math.random() * 150,
            color: Math.random() > 0.3 ? '#ffffff' : '#38bdf8',
          };
        case 'fireplace':
          return {
            x: width * 0.4 + Math.random() * (width * 0.2),
            y: init ? height * 0.7 + Math.random() * (height * 0.3) : height + 10,
            vx: (Math.random() - 0.5) * 1.1,
            vy: -1.0 - Math.random() * 2.2,
            size: 1.2 + Math.random() * 2.5,
            alpha: 0.4 + Math.random() * 0.5,
            maxAlpha: 0.9,
            life: 0,
            maxLife: 180 + Math.random() * 100,
            color: Math.random() > 0.5 ? '#f59e0b' : '#f97316',
          };
        case 'ocean':
        default:
          return {
            x: Math.random() * width,
            y: init ? Math.random() * height : height * 0.6 + Math.random() * (height * 0.4),
            vx: 0.4 + Math.random() * 0.7,
            vy: -0.2 - Math.random() * 0.3,
            size: 1.2 + Math.random() * 2.0,
            alpha: 0.1 + Math.random() * 0.25,
            maxAlpha: 0.35,
            life: 0,
            maxLife: 300,
            color: '#38bdf8',
          };
      }
    };

    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;

        if (currentScene === 'rainy-window') {
          p.x += p.vx;
          p.y += p.vy;

          ctx.strokeStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 1.8, p.y + (p.length || 15));
          ctx.stroke();

          if (p.y > height + 20 || p.x < -20) {
            particles[i] = createParticle(false);
          }
        } else if (currentScene === 'night-sky') {
          const twinkle = Math.sin((p.life / p.maxLife) * Math.PI * 2);
          const currentAlpha = Math.max(0.1, p.alpha * (0.6 + 0.4 * twinkle));

          ctx.fillStyle = p.color;
          ctx.globalAlpha = currentAlpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
            particles[i] = createParticle(true);
          }
        } else if (currentScene === 'fireplace') {
          p.vx += (Math.random() - 0.5) * 0.15;
          p.x += p.vx;
          p.y += p.vy;
          const progress = p.life / p.maxLife;
          const currentAlpha = p.maxAlpha * (1 - progress);

          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, currentAlpha);
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.5, p.size * (1 - progress * 0.5)), 0, Math.PI * 2);
          ctx.fill();

          if (p.life >= p.maxLife || p.y < height * 0.2) {
            particles[i] = createParticle(false);
          }
        } else {
          p.x += p.vx + Math.sin(p.life * 0.02) * 0.3;
          p.y += p.vy;
          const progress = p.life / p.maxLife;
          const currentAlpha = Math.sin(progress * Math.PI) * p.maxAlpha;

          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, currentAlpha);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          if (p.life >= p.maxLife || p.y < -10 || p.x > width + 20 || p.x < -20) {
            particles[i] = createParticle(false);
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentScene]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-50 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
};
