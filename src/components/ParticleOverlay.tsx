import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {WINDOW} from '../styles/palette';
import {clamp} from './anim';

// Partículas ambientales deterministas (semillas fijas con random() de Remotion),
// parecidas a las luciérnagas de la pantalla de título del juego.
export const ParticleOverlay: React.FC<{
  count?: number;
  seed?: string;
  duration: number;
  color?: string;
  opacity?: number;
}> = ({count = 34, seed = 'motes', duration, color = '255,236,170', opacity = 0.8}) => {
  const frame = useCurrentFrame();
  const parts = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        x: random(`${seed}-x-${i}`) * 1080,
        y: WINDOW.top + 40 + random(`${seed}-y-${i}`) * (WINDOW.height - 80),
        r: 2 + random(`${seed}-r-${i}`) * 4.5,
        speed: 0.25 + random(`${seed}-s-${i}`) * 0.6,
        sway: 10 + random(`${seed}-w-${i}`) * 26,
        phase: random(`${seed}-p-${i}`) * Math.PI * 2,
        tw: 0.04 + random(`${seed}-t-${i}`) * 0.06,
      })),
    [count, seed],
  );
  const fade = interpolate(frame, [0, 15, duration - 15, duration], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: fade * opacity, mixBlendMode: 'screen'}}>
      {parts.map((p, i) => {
        const y = p.y - frame * p.speed;
        const x = p.x + Math.sin(frame * 0.03 + p.phase) * p.sway;
        const tw = 0.45 + 0.55 * Math.abs(Math.sin(frame * p.tw + p.phase));
        if (y < WINDOW.top + 10 || y > WINDOW.top + WINDOW.height - 10) {
          return null;
        }
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: p.r * 2,
              height: p.r * 2,
              borderRadius: '50%',
              opacity: tw,
              background: `radial-gradient(circle, rgba(${color},1) 0%, rgba(${color},0.35) 45%, rgba(${color},0) 72%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
