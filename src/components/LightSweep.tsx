import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {WINDOW} from '../styles/palette';
import {clamp, easeInOut} from './anim';

// Barrido luminoso diagonal y breve sobre la ventana de gameplay.
// Se usa en los cortes de tipo "lightSweep" (transición B) y nunca de forma constante.
export const LightSweep: React.FC<{duration: number; strength?: number; color?: string}> = ({
  duration,
  strength = 0.55,
  color = '255,244,214',
}) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, duration], [-60, 160], {...clamp, easing: easeInOut});
  const a = interpolate(frame, [0, duration * 0.25, duration * 0.75, duration], [0, strength, strength, 0], clamp);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: WINDOW.top,
          width: WINDOW.width,
          height: WINDOW.height,
          overflow: 'hidden',
          mixBlendMode: 'screen',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -200,
            bottom: -200,
            left: `${x}%`,
            width: 360,
            translate: '-50% 0px',
            rotate: '18deg',
            opacity: a,
            background: `linear-gradient(90deg, rgba(${color},0) 0%, rgba(${color},0.55) 42%, rgba(255,255,255,0.95) 50%, rgba(${color},0.55) 58%, rgba(${color},0) 100%)`,
            filter: 'blur(6px)',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
