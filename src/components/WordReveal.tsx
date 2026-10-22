import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {fonts, LAYOUT, palette} from '../styles/palette';
import {clamp, easeIn, easeOut} from './anim';

type Word = {text: string; color?: string};

// B. WordReveal: palabras o grupos que entran en secuencia (desplazamiento
// vertical + desenfoque breve). Cada palabra queda legible completa.
export const WordReveal: React.FC<{
  words: Word[];
  delay?: number;
  size?: number;
  exitAt?: number;
  centerY?: number;
  direction?: 'column' | 'row';
}> = ({words, delay = 3, size = 76, exitAt, centerY = LAYOUT.titleCenterY, direction = 'column'}) => {
  const frame = useCurrentFrame();
  const exit = exitAt === undefined ? 0 : interpolate(frame, [exitAt, exitAt + 8], [0, 1], {...clamp, easing: easeIn});
  return (
    <div
      style={{
        position: 'absolute',
        left: LAYOUT.sideMargin,
        right: LAYOUT.sideMargin,
        top: centerY,
        translate: '0px -50%',
        display: 'flex',
        flexDirection: direction,
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 22,
        rowGap: 6,
        opacity: 1 - exit,
      }}
    >
      {words.map((w, i) => {
        const p = interpolate(frame, [i * delay, i * delay + 12], [0, 1], {...clamp, easing: easeOut});
        return (
          <div
            key={i}
            style={{
              fontFamily: fonts.display,
              fontSize: size,
              lineHeight: 1.04,
              textTransform: 'uppercase',
              color: w.color ?? palette.paper,
              opacity: p,
              translate: `0px ${(1 - p) * 34 - exit * 14}px`,
              filter: `blur(${(1 - p) * 8}px)`,
              textShadow: '0 6px 26px rgba(11,16,32,0.55), 0 2px 4px rgba(11,16,32,0.6)',
              whiteSpace: 'nowrap',
            }}
          >
            {w.text}
          </div>
        );
      })}
    </div>
  );
};
