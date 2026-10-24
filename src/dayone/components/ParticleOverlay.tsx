import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {WIN} from '../data/palette';
import {clamp} from './motion';

// Partículas sutiles: pocas, lentas, baja opacidad y posiciones deterministas (random con semilla).
export const ParticleOverlay: React.FC<{duration: number; seed: string; count?: number; color?: string; opacity?: number}> = ({
  duration,
  seed,
  count = 22,
  color = '244,199,106',
  opacity = 0.6,
}) => {
  const frame = useCurrentFrame();
  const parts = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        x: 60 + random(`${seed}x${i}`) * 960,
        y: WIN.top + 60 + random(`${seed}y${i}`) * (WIN.height - 120),
        r: 2 + random(`${seed}r${i}`) * 3.5,
        v: 0.18 + random(`${seed}v${i}`) * 0.4,
        w: 8 + random(`${seed}w${i}`) * 20,
        ph: random(`${seed}p${i}`) * Math.PI * 2,
      })),
    [count, seed],
  );
  const fade = interpolate(frame, [0, 18, duration - 18, duration], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: fade * opacity, mixBlendMode: 'screen'}}>
      {parts.map((p, i) => {
        const y = p.y - frame * p.v;
        if (y < WIN.top + 20) {
          return null;
        }
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x + Math.sin(frame * 0.03 + p.ph) * p.w,
              top: y,
              width: p.r * 2,
              height: p.r * 2,
              borderRadius: '50%',
              opacity: 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.05 + p.ph)),
              background: `radial-gradient(circle, rgba(${color},1) 0%, rgba(${color},0.3) 45%, rgba(${color},0) 72%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
