import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {SubtitleSegment} from '../data/subtitles';
import {fonts, LAYOUT, palette} from '../styles/palette';
import {clamp, easeOut} from './anim';

// D. Subtitle: aparece sincronizado con la narración, máx. 2 líneas,
// palabras clave resaltadas, fondo translúcido para contraste.
export const Subtitles: React.FC<{segments: SubtitleSegment[]}> = ({segments}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const seg = segments.find((s) => !s.hideOnScreen && ms >= s.startMs && ms < s.endMs);
  if (!seg) {
    return null;
  }
  const local = frame - Math.round((seg.startMs / 1000) * fps);
  const end = Math.round((seg.endMs / 1000) * fps) - frame;
  const pIn = interpolate(local, [0, 6], [0, 1], {...clamp, easing: easeOut});
  const pOut = interpolate(end, [0, 4], [0, 1], clamp);
  const accent = seg.accent === 'gold' ? palette.gold : palette.cyan;
  const keys = new Set(seg.keywords ?? []);

  return (
    <div
      style={{
        position: 'absolute',
        left: LAYOUT.sideMargin - 20,
        right: LAYOUT.sideMargin - 20,
        top: LAYOUT.subtitleTop,
        display: 'flex',
        justifyContent: 'center',
        opacity: Math.min(pIn, pOut),
        translate: `0px ${(1 - pIn) * 12}px`,
      }}
    >
      <div
        style={{
          fontFamily: fonts.text,
          fontWeight: 600,
          fontSize: 44,
          lineHeight: 1.28,
          color: palette.paper,
          textAlign: 'center',
          padding: '14px 26px 16px',
          borderRadius: 18,
          background: 'rgba(11,16,32,0.58)',
          boxShadow: '0 10px 30px rgba(11,16,32,0.35)',
          textShadow: '0 2px 6px rgba(11,16,32,0.5)',
        }}
      >
        {seg.text.split('\n').map((line, li) => (
          <div key={li} style={{whiteSpace: 'nowrap'}}>
            {line.split(' ').map((word, wi) => (
              <span key={wi} style={{color: keys.has(word) ? accent : undefined}}>
                {wi > 0 ? ' ' : ''}
                {word}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
