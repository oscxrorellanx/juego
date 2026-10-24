import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../data/palette';
import {enter, exit, textShadow} from './motion';
import {LightSweep} from './LightSweep';

export type Seg = {t: string; c?: string};
export type Line = {segs: Seg[]; size?: number};

export const lineText = (l: Line) => l.segs.map((s) => s.t).join('');

// Título cinético: cada línea entra con spring (opacidad 0→1, escala 0,9→1,
// desplazamiento 44 px → 0) en 12 fotogramas y sale en 8 fotogramas.
export const KineticText: React.FC<{
  lines: Line[];
  size?: number;
  stagger?: number;
  exitAt?: number;
  centerY?: number;
  sweepAt?: number;
}> = ({lines, size = 84, stagger = 4, exitAt, centerY = SAFE.titleY, sweepAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const out = exit(frame, exitAt, 8);
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.side - 30,
        right: SAFE.side - 30,
        top: centerY,
        translate: `0px calc(-50% - ${out * 14}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: 1 - out,
      }}
    >
      {lines.map((l, i) => {
        const p = enter(frame, fps, i * stagger, 12);
        const fs = l.size ?? size;
        return (
          <div
            key={i}
            style={{
              position: 'relative',
              fontFamily: FONT.display,
              fontSize: fs,
              lineHeight: 1.04,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              color: C.white,
              opacity: p,
              scale: String(0.9 + 0.1 * p),
              translate: `0px ${(1 - p) * 44}px`,
              textShadow,
            }}
          >
            {l.segs.map((s, j) => (
              <span key={j} style={{color: s.c}}>
                {s.t}
              </span>
            ))}
            {sweepAt !== undefined ? <LightSweep text={lineText(l)} frame={frame - sweepAt - i * 3} /> : null}
          </div>
        );
      })}
    </div>
  );
};
