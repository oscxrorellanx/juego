import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {fonts, LAYOUT, palette} from '../styles/palette';
import {clamp, easeIn, easeOut} from './anim';
import {Sweep, TitleLine} from './KineticTitle';

// C. ImpactTitle: entrada rápida (escala + opacidad + desplazamiento mínimo)
// con una sobreimpresión luminosa que se apaga. Sin vibraciones.
export const ImpactTitle: React.FC<{
  lines: TitleLine[];
  size?: number;
  glow?: string;
  exitAt?: number;
  centerY?: number;
  stagger?: number;
  sweepAt?: number | null;
}> = ({lines, size = 80, glow = palette.cyan, exitAt, centerY = LAYOUT.titleCenterY, stagger = 4, sweepAt = null}) => {
  const frame = useCurrentFrame();
  const exit = exitAt === undefined ? 0 : interpolate(frame, [exitAt, exitAt + 7], [0, 1], {...clamp, easing: easeIn});
  return (
    <div
      style={{
        position: 'absolute',
        left: LAYOUT.sideMargin - 40,
        right: LAYOUT.sideMargin - 40,
        top: centerY,
        translate: '0px -50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: 1 - exit,
        scale: String(1 - exit * 0.04),
      }}
    >
      {lines.map((line, i) => {
        const s = i * stagger;
        const p = interpolate(frame, [s, s + 7], [0, 1], {...clamp, easing: easeOut});
        const glowAmt = interpolate(frame, [s + 2, s + 20], [1, 0.18], clamp);
        const fs = line.size ?? size;
        return (
          <div
            key={i}
            style={{
              position: 'relative',
              fontFamily: fonts.display,
              fontSize: fs,
              lineHeight: 1.02,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              color: line.color ?? palette.paper,
              opacity: p,
              scale: String(1.22 - 0.22 * p),
              translate: `0px ${(1 - p) * 10}px`,
              textShadow: `0 0 ${18 + 30 * glowAmt}px ${glow}${Math.round(glowAmt * 160)
                .toString(16)
                .padStart(2, '0')}, 0 6px 26px rgba(11,16,32,0.6)`,
            }}
          >
            {line.text}
            {sweepAt !== null ? <Sweep text={line.text} frame={frame - sweepAt - i * 3} /> : null}
          </div>
        );
      })}
    </div>
  );
};
