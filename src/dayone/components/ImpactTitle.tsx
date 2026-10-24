import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, SAFE} from '../data/palette';
import {clamp, easeOut, exit, textShadow} from './motion';
import {LightSweep} from './LightSweep';
import {Line, lineText} from './KineticText';

// Título de impacto: escala 0,85→1, desenfoque 8 px→0 y opacidad 0→1 en 10 fotogramas,
// con resplandor que se apaga. Opcionalmente, velo oscuro detrás (sin tapar el gameplay).
export const ImpactTitle: React.FC<{
  lines: Line[];
  size?: number;
  entry?: number;
  stagger?: number;
  exitAt?: number;
  centerY?: number;
  glow?: string;
  sweepAt?: number;
  scrim?: boolean;
}> = ({lines, size = 96, entry = 10, stagger = 3, exitAt, centerY = SAFE.titleY, glow = C.cyan, sweepAt, scrim}) => {
  const frame = useCurrentFrame();
  const out = exit(frame, exitAt, 8);
  const scrimA = interpolate(frame, [0, entry], [0, 1], clamp) * (1 - out);
  return (
    <>
      {scrim ? (
        <div
          style={{
            position: 'absolute',
            left: -100,
            right: -100,
            top: centerY - 420,
            height: 840,
            opacity: scrimA,
            background: 'radial-gradient(ellipse 52% 46% at 50% 50%, rgba(11,16,32,0.72) 0%, rgba(11,16,32,0.45) 55%, rgba(11,16,32,0) 100%)',
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: SAFE.side - 40,
          right: SAFE.side - 40,
          top: centerY,
          translate: `0px calc(-50% - ${out * 12}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: 1 - out,
        }}
      >
        {lines.map((l, i) => {
          const s = i * stagger;
          const p = interpolate(frame, [s, s + entry], [0, 1], {...clamp, easing: easeOut});
          const g = interpolate(frame, [s + 2, s + 22], [1, 0.2], clamp);
          const fs = l.size ?? size;
          return (
            <div
              key={i}
              style={{
                position: 'relative',
                fontFamily: FONT.display,
                fontSize: fs,
                lineHeight: 1.02,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                color: C.white,
                opacity: p,
                scale: String(0.85 + 0.15 * p),
                filter: `blur(${(1 - p) * 8}px)`,
                textShadow: `0 0 ${16 + 28 * g}px ${glow}${Math.round(g * 150)
                  .toString(16)
                  .padStart(2, '0')}, ${textShadow}`,
              }}
            >
              {l.segs.map((sg, j) => (
                <span key={j} style={{color: sg.c}}>
                  {sg.t}
                </span>
              ))}
              {sweepAt !== undefined ? <LightSweep text={lineText(l)} frame={frame - sweepAt - i * 2} /> : null}
            </div>
          );
        })}
      </div>
    </>
  );
};
