import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, SAFE, WIN} from '../data/palette';
import {clamp, easeIn, easeOut} from './motion';

// Etiqueta pequeña con rombo y línea fina (solo textos reales del juego o verbos de acción).
export const EditorialLabel: React.FC<{text: string; duration: number; color?: string}> = ({text, duration, color = C.cyan}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [3, 15], [0, 1], {...clamp, easing: easeOut});
  const line = interpolate(frame, [0, 14], [0, 1], {...clamp, easing: easeOut});
  const out = interpolate(frame, [duration - 7, duration], [0, 1], {...clamp, easing: easeIn});
  return (
    <div style={{position: 'absolute', top: WIN.top + 30, left: SAFE.side, display: 'flex', alignItems: 'center', gap: 14, opacity: 1 - out}}>
      <div style={{width: 11, height: 11, rotate: '45deg', background: C.gold, opacity: line, boxShadow: `0 0 10px ${C.gold}`}} />
      <div style={{width: 64 * line, height: 2, background: `linear-gradient(90deg, ${color}, rgba(100,229,255,0.1))`}} />
      <div style={{overflow: 'hidden'}}>
        <div
          style={{
            fontFamily: FONT.text,
            fontWeight: 600,
            fontSize: 28,
            letterSpacing: '0.22em',
            color: C.white,
            whiteSpace: 'nowrap',
            translate: `${(1 - p) * -100}% 0px`,
            textShadow: '0 2px 10px rgba(11,16,32,0.95)',
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};
