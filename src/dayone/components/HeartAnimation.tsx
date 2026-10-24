import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, enter} from './motion';

// Corazón de "like": aparece con un pequeño latido (escala por spring) y emite un anillo.
export const HeartAnimation: React.FC<{at: number; size?: number; color?: string}> = ({at, size = 92, color = '#FF4D6D'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = enter(frame, fps, at, 10);
  const beat = interpolate(frame, [at + 10, at + 15, at + 22], [1, 1.14, 1], clamp);
  const ring = interpolate(frame, [at + 8, at + 26], [0, 1], clamp);
  return (
    <div style={{position: 'relative', width: size, height: size, opacity: p, scale: String((0.6 + 0.4 * p) * beat)}}>
      <div
        style={{
          position: 'absolute',
          inset: -size * 0.35 * ring,
          borderRadius: '50%',
          border: `3px solid ${color}`,
          opacity: (1 - ring) * 0.8,
        }}
      />
      <svg viewBox="0 0 24 24" width={size} height={size} style={{filter: `drop-shadow(0 0 14px ${color}aa)`}}>
        <path
          d="M12 21s-7.5-4.6-10-9.3C.3 8.4 2.1 4.5 6 4.1c2.2-.2 3.8 1 4.6 2.4h2.8c.8-1.4 2.4-2.6 4.6-2.4 3.9.4 5.7 4.3 4 7.6C19.5 16.4 12 21 12 21z"
          fill={color}
        />
      </svg>
    </div>
  );
};
