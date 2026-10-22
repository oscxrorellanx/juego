import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {fonts, LAYOUT, palette, WINDOW} from '../styles/palette';
import {clamp, easeIn, easeOut} from './anim';

// E. CinematicCaption: etiqueta editorial pequeña con línea fina y rombo,
// revelada por máscara. Se usa solo con nombres que aparecen en el propio juego.
export const CinematicCaption: React.FC<{
  text: string;
  index?: string;
  duration: number;
  align?: 'left' | 'right';
  top?: number;
}> = ({text, index, duration, align = 'left', top = WINDOW.top + 6}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [4, 18], [0, 1], {...clamp, easing: easeOut});
  const line = interpolate(frame, [0, 16], [0, 1], {...clamp, easing: easeOut});
  const out = interpolate(frame, [duration - 8, duration], [0, 1], {...clamp, easing: easeIn});
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: align === 'left' ? LAYOUT.sideMargin : undefined,
        right: align === 'right' ? LAYOUT.sideMargin : undefined,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        flexDirection: align === 'left' ? 'row' : 'row-reverse',
        opacity: 1 - out,
      }}
    >
      <div style={{width: 11, height: 11, rotate: '45deg', background: palette.gold, opacity: line, boxShadow: `0 0 10px ${palette.gold}`}} />
      <div style={{width: 70 * line, height: 2, background: `linear-gradient(90deg, ${palette.cyan}, rgba(86,217,255,0.15))`}} />
      <div style={{overflow: 'hidden'}}>
        <div
          style={{
            fontFamily: fonts.text,
            fontWeight: 600,
            fontSize: 27,
            letterSpacing: '0.24em',
            color: palette.paper,
            whiteSpace: 'nowrap',
            translate: `${(1 - p) * -100}% 0px`,
            textShadow: '0 2px 10px rgba(11,16,32,0.9)',
          }}
        >
          {index ? <span style={{color: palette.cyan, marginRight: 14}}>{index}</span> : null}
          {text}
        </div>
      </div>
    </div>
  );
};
