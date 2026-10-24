import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {DaySubtitle} from '../data/subtitles';
import {C, FONT, SAFE} from '../data/palette';
import {clamp, easeOut} from './motion';

// Divide el texto en trozos normales y frases clave (las claves pueden tener varias palabras).
const split = (text: string, keys: string[]) => {
  const parts: {t: string; key: boolean}[] = [];
  let rest = text;
  while (rest.length > 0) {
    let best: {i: number; k: string} | null = null;
    for (const k of keys) {
      const i = rest.toLowerCase().indexOf(k.toLowerCase());
      if (i >= 0 && (best === null || i < best.i)) {
        best = {i, k};
      }
    }
    if (!best) {
      parts.push({t: rest, key: false});
      break;
    }
    if (best.i > 0) {
      parts.push({t: rest.slice(0, best.i), key: false});
    }
    parts.push({t: rest.slice(best.i, best.i + best.k.length), key: true});
    rest = rest.slice(best.i + best.k.length);
  }
  return parts;
};

// Subtítulos sincronizados con la voz: blanco, palabras clave doradas, máx. 2 líneas.
export const MotionSubtitle: React.FC<{segments: DaySubtitle[]}> = ({segments}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const seg = segments.find((s) => !s.hideOnScreen && ms >= s.startMs && ms < s.endMs + 120);
  if (!seg) {
    return null;
  }
  const local = frame - (seg.startMs / 1000) * fps;
  const toEnd = ((seg.endMs + 120) / 1000) * fps - frame;
  const pIn = interpolate(local, [0, 5], [0, 1], {...clamp, easing: easeOut});
  const pOut = interpolate(toEnd, [0, 3], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.side - 30,
        right: SAFE.side - 30,
        top: SAFE.subtitleTop,
        display: 'flex',
        justifyContent: 'center',
        opacity: Math.min(pIn, pOut),
        translate: `0px ${(1 - pIn) * 10}px`,
        scale: String(0.97 + 0.03 * pIn),
      }}
    >
      <div
        style={{
          fontFamily: FONT.text,
          fontWeight: 600,
          fontSize: 46,
          lineHeight: 1.26,
          color: C.white,
          textAlign: 'center',
          padding: '12px 24px 14px',
          borderRadius: 18,
          background: 'rgba(11,16,32,0.5)',
          textShadow: '0 2px 8px rgba(11,16,32,0.75)',
        }}
      >
        {seg.text.split('\n').map((line, li) => (
          <div key={li} style={{whiteSpace: 'nowrap'}}>
            {split(line, seg.keys).map((p, i) => (
              <span key={i} style={{color: p.key ? C.gold : undefined}}>
                {p.t}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
