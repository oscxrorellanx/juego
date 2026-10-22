import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

// Grano de película muy sutil. La semilla cambia con el fotograma (determinista).
export const FilmGrain: React.FC<{opacity?: number}> = ({opacity = 0.05}) => {
  const frame = useCurrentFrame();
  const seed = frame % 12;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity, mixBlendMode: 'overlay'}}>
      <svg width="100%" height="100%" viewBox="0 0 540 960" preserveAspectRatio="none">
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

// Viñeta periférica moderada para dirigir la atención.
export const Vignette: React.FC<{strength?: number}> = ({strength = 0.5}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 75% 55% at 50% 47%, rgba(11,16,32,0) 55%, rgba(11,16,32,${strength}) 100%)`,
    }}
  />
);
