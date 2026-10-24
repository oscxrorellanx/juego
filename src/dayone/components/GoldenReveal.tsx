import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE} from '../data/palette';
import {clamp, enter, exit, textShadow} from './motion';
import {LightSweep} from './LightSweep';

export type RevealItem = {
  text: string;
  at: number; // fotograma local de aparición (sincronizado con la voz)
  gold?: boolean; // palabra dorada con resplandor
  size?: number;
};

// Revelado de palabras con resplandor dorado para los mensajes emocionales
// ("DÍA UNO", "RECORDARÉ A LOS DEL DÍA UNO").
export const GoldenReveal: React.FC<{
  items: RevealItem[];
  lead?: {text: string; at: number};
  size?: number;
  exitAt?: number;
  centerY?: number;
}> = ({items, lead, size = 84, exitAt, centerY = SAFE.titleY}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const out = exit(frame, exitAt, 10);
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.side - 40,
        right: SAFE.side - 40,
        top: centerY,
        translate: `0px calc(-50% - ${out * 16}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: 1 - out,
      }}
    >
      {lead ? (
        <div
          style={{
            fontFamily: FONT.text,
            fontWeight: 600,
            fontSize: 44,
            letterSpacing: '0.04em',
            color: C.white,
            marginBottom: 10,
            opacity: enter(frame, fps, lead.at, 12) * 0.92,
            translate: `0px ${(1 - enter(frame, fps, lead.at, 12)) * 30}px`,
            textShadow,
          }}
        >
          {lead.text}
        </div>
      ) : null}
      {items.map((it, i) => {
        const p = enter(frame, fps, it.at, 14);
        const fs = it.size ?? size;
        const glow = it.gold ? interpolate(frame, [it.at + 4, it.at + 18, it.at + 60], [0, 1, 0.55], clamp) : 0;
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
              color: it.gold ? C.gold : C.white,
              opacity: p,
              scale: String(0.9 + 0.1 * p),
              translate: `0px ${(1 - p) * 40}px`,
              filter: it.gold
                ? `blur(${(1 - p) * 6}px) drop-shadow(0 0 ${10 + 22 * glow}px rgba(244,199,106,${0.65 * glow}))`
                : `blur(${(1 - p) * 6}px)`,
              textShadow,
            }}
          >
            {it.text}
            {it.gold ? <LightSweep text={it.text} frame={frame - it.at - 10} duration={14} /> : null}
          </div>
        );
      })}
    </div>
  );
};
