import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {fonts, LAYOUT, palette} from '../styles/palette';
import {clamp, easeIn, easeOut} from './anim';

export type TitleLine = {
  text: string;
  color?: string;
  size?: number; // px
};

type Props = {
  lines: TitleLine[];
  size?: number;
  stagger?: number; // fotogramas entre líneas
  entry?: number; // duración de entrada (10–18 f)
  exitAt?: number; // fotograma local en el que empieza la salida
  centerY?: number;
  drift?: number; // desplazamiento horizontal lento (px en toda la duración)
  driftDuration?: number;
  sweepAt?: number | null; // fotograma del barrido de luz sobre el texto
};

// A. KineticTitle: revelado por máscara + translateY + opacidad + escala 0,92→1
// + desenfoque breve que termina en nitidez. Sin rebotes.
export const KineticTitle: React.FC<Props> = ({
  lines,
  size = 84,
  stagger = 5,
  entry = 15,
  exitAt,
  centerY = LAYOUT.titleCenterY,
  drift = 0,
  driftDuration = 150,
  sweepAt = null,
}) => {
  const frame = useCurrentFrame();
  const exit = exitAt === undefined ? 0 : interpolate(frame, [exitAt, exitAt + 9], [0, 1], {...clamp, easing: easeIn});
  const dx = interpolate(frame, [0, driftDuration], [0, drift], clamp);

  return (
    <div
      style={{
        position: 'absolute',
        left: LAYOUT.sideMargin - 40,
        right: LAYOUT.sideMargin - 40,
        top: centerY,
        translate: `${dx}px -50%`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        opacity: 1 - exit,
      }}
    >
      {lines.map((line, i) => {
        const start = i * stagger;
        const p = interpolate(frame, [start, start + entry], [0, 1], {...clamp, easing: easeOut});
        const fs = line.size ?? size;
        return (
          <div key={i} style={{overflow: 'hidden', padding: '0.06em 0.12em', marginBottom: -fs * 0.05}}>
            <div
              style={{
                position: 'relative',
                fontFamily: fonts.display,
                fontSize: fs,
                lineHeight: 1.0,
                letterSpacing: '0.01em',
                textTransform: 'uppercase',
                color: line.color ?? palette.paper,
                whiteSpace: 'nowrap',
                translate: `0px ${(1 - p) * 105 - exit * 18}%`,
                scale: String(0.92 + 0.08 * p),
                filter: `blur(${(1 - p) * 9}px)`,
                textShadow: '0 6px 28px rgba(11,16,32,0.55), 0 2px 4px rgba(11,16,32,0.6)',
              }}
            >
              {line.text}
              {sweepAt !== null ? <Sweep text={line.text} frame={frame - sweepAt - i * 3} /> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Barrido de luz que recorre las letras una vez (B. light sweep sobre texto).
export const Sweep: React.FC<{text: string; frame: number; duration?: number}> = ({text, frame, duration = 16}) => {
  if (frame < 0 || frame > duration) {
    return null;
  }
  const pos = interpolate(frame, [0, duration], [130, -30], clamp);
  return (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        color: 'transparent',
        backgroundImage:
          'linear-gradient(105deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 60%)',
        backgroundSize: '300% 100%',
        backgroundPosition: `${pos}% 0%`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        textShadow: 'none',
      }}
    >
      {text}
    </span>
  );
};
