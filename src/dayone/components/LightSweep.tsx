import React from 'react';
import {interpolate} from 'remotion';
import {clamp, easeInOut} from './motion';

// Barrido luminoso sobre un texto (8–14 fotogramas, opacidad moderada).
// Se coloca dentro del contenedor del texto (position: relative).
export const LightSweep: React.FC<{text: string; frame: number; duration?: number; strength?: number}> = ({
  text,
  frame,
  duration = 12,
  strength = 0.9,
}) => {
  if (frame < 0 || frame > duration) {
    return null;
  }
  const pos = interpolate(frame, [0, duration], [130, -30], {...clamp, easing: easeInOut});
  return (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        color: 'transparent',
        backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0) 40%, rgba(255,255,255,${strength}) 50%, rgba(255,255,255,0) 60%)`,
        backgroundSize: '300% 100%',
        backgroundPosition: `${pos}% 0%`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        textShadow: 'none',
        whiteSpace: 'inherit',
      }}
    >
      {text}
    </span>
  );
};
