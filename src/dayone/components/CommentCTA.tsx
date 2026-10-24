import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE, WIN} from '../data/palette';
import {clamp, enter, textShadow} from './motion';
import {HeartAnimation} from './HeartAnimation';
import {LightSweep} from './LightSweep';

// Escena 7: tres llamadas a la acción sucesivas, sincronizadas con la voz.
// Quedan las tres visibles hasta el último fotograma.
export const CommentCTA: React.FC<{enterAt: number; likeAt: number; commentAt: number; phraseAt: number}> = ({
  enterAt,
  likeAt,
  commentAt,
  phraseAt,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = enter(frame, fps, enterAt, 12);
  const b = enter(frame, fps, likeAt, 12);
  const c = enter(frame, fps, commentAt, 14);
  const glow = interpolate(frame, [phraseAt, phraseAt + 14, phraseAt + 40, phraseAt + 70], [0, 1, 0.6, 0.85], clamp);
  const phrase = enter(frame, fps, phraseAt, 12);
  const dim = interpolate(frame, [0, 12], [0, 0.42], clamp);

  return (
    <>
      {/* velo sobre la banda de gameplay para que los textos se lean */}
      <div style={{position: 'absolute', left: 0, right: 0, top: WIN.top, height: WIN.height, background: `rgba(11,16,32,${dim})`}} />

      {/* 1 — ENTRA AL JUEGO */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.side - 30,
          right: SAFE.side - 30,
          top: SAFE.titleY,
          translate: `0px calc(-50% + ${(1 - a) * 44}px)`,
          textAlign: 'center',
          fontFamily: FONT.display,
          fontSize: 96,
          lineHeight: 1,
          color: C.white,
          opacity: a,
          scale: String(0.9 + 0.1 * a),
          textShadow,
        }}
      >
        ENTRA AL <span style={{color: C.cyan}}>JUEGO</span>
      </div>

      {/* 2 — DA LIKE Y SÍGUEME */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 690,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 18,
          opacity: b,
          translate: `0px ${(1 - b) * 40}px`,
        }}
      >
        <HeartAnimation at={likeAt} size={70} />
        <div style={{fontFamily: FONT.display, fontSize: 68, color: C.white, whiteSpace: 'nowrap', textShadow, scale: String(0.9 + 0.1 * b)}}>
          DA LIKE Y SÍGUEME
        </div>
      </div>

      {/* 3 — COMENTA: YO ESTUVE AQUÍ (burbuja de comentario) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 860,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: c,
          translate: `0px ${(1 - c) * 44}px`,
          scale: String(0.9 + 0.1 * c),
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14}}>
          <svg viewBox="0 0 24 24" width={52} height={52} style={{filter: `drop-shadow(0 0 10px ${C.cyan}88)`}}>
            <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill={C.white} />
            <circle cx="8" cy="11" r="1.4" fill={C.ink} />
            <circle cx="12" cy="11" r="1.4" fill={C.ink} />
            <circle cx="16" cy="11" r="1.4" fill={C.ink} />
          </svg>
          <div style={{fontFamily: FONT.text, fontWeight: 800, fontSize: 48, letterSpacing: '0.08em', color: C.white, textShadow}}>COMENTA:</div>
        </div>
        <div
          style={{
            position: 'relative',
            padding: '22px 40px 26px',
            borderRadius: 28,
            background: 'rgba(11,16,32,0.72)',
            border: `3px solid ${C.gold}`,
            boxShadow: `0 0 ${20 + 40 * glow}px rgba(244,199,106,${0.25 + 0.45 * glow}), inset 0 0 30px rgba(244,199,106,0.12)`,
            opacity: phrase,
            scale: String(0.88 + 0.12 * phrase),
          }}
        >
          <div
            style={{
              position: 'relative',
              fontFamily: FONT.display,
              fontSize: 72,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              color: C.gold,
              filter: `drop-shadow(0 0 ${8 + 16 * glow}px rgba(244,199,106,${0.6 * glow}))`,
            }}
          >
            YO ESTUVE AQUÍ
            <LightSweep text="YO ESTUVE AQUÍ" frame={frame - phraseAt - 12} duration={14} />
          </div>
          {/* cola de la burbuja */}
          <div
            style={{
              position: 'absolute',
              left: 70,
              bottom: -20,
              width: 34,
              height: 34,
              rotate: '45deg',
              background: 'rgba(11,16,32,0.72)',
              borderRight: `3px solid ${C.gold}`,
              borderBottom: `3px solid ${C.gold}`,
            }}
          />
        </div>
      </div>
    </>
  );
};
