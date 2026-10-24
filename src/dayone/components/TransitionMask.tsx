import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../data/palette';
import {clamp, easeInOut} from './motion';

// Máscara direccional (diagonal) para el plano entrante: p = 0 → oculto, p = 1 → visible.
const edge = (p: number) => interpolate(p, [0, 1], [-25, 125], {...clamp, easing: easeInOut});

export const maskWipeClip = (p: number) => {
  if (p >= 1) {
    return undefined;
  }
  const a = edge(p);
  return `polygon(0% 0%, ${a + 25}% 0%, ${a}% 100%, 0% 100%)`;
};

// Filo luminoso que acompaña a la máscara (misma geometría).
export const TransitionMask: React.FC<{duration: number; color?: string}> = ({duration, color = C.cyan}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, duration], [0, 1], clamp);
  const a = edge(p);
  const x0 = ((a + 25) / 100) * 1080;
  const x1 = (a / 100) * 1080;
  const angle = Math.atan2(1920, x1 - x0) * (180 / Math.PI);
  const len = Math.hypot(x1 - x0, 1920);
  const opacity = interpolate(p, [0, 0.15, 0.85, 1], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      <div
        style={{
          position: 'absolute',
          left: x0,
          top: 0,
          width: len,
          height: 4,
          transformOrigin: '0 50%',
          rotate: `${angle}deg`,
          background: `linear-gradient(90deg, ${color}00, ${color} 30%, #ffffff 50%, ${color} 70%, ${color}00)`,
          boxShadow: `0 0 22px 6px ${color}88`,
        }}
      />
    </AbsoluteFill>
  );
};
