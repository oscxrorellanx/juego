import {Video} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {DayShot} from '../data/timeline';
import {C, WIN} from '../data/palette';
import {cinematicZoom} from './CinematicZoom';
import {clamp, easeIn, easeInOut, easeOut} from './motion';
import {maskWipeClip} from './TransitionMask';

const F = WIN.feather;
const H = WIN.height;
const MASK = `linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0.15) ${F * 0.25}px, rgba(0,0,0,0.5) ${F * 0.5}px, rgba(0,0,0,0.88) ${F * 0.8}px, black ${F}px, black ${H - F}px, rgba(0,0,0,0.88) ${H - F * 0.8}px, rgba(0,0,0,0.5) ${H - F * 0.5}px, rgba(0,0,0,0.15) ${H - F * 0.25}px, rgba(0,0,0,0) ${H}px)`;

// Plano de gameplay vertical: fondo ampliado y desenfocado + banda nítida con cámara
// simulada y transición de entrada. La corrección de color es mínima (identidad del juego intacta).
export const GameplayShot: React.FC<{shot: DayShot}> = ({shot}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const total = shot.frames + shot.overlap;
  const p = shot.overlap > 0 ? interpolate(frame, [0, shot.overlap], [0, 1], clamp) : 1;

  let opacity = 1;
  let clipPath: string | undefined;
  let tx = 0;
  let dirBlur = 0;
  let extra = 1;
  let flash = 0;
  switch (shot.trans) {
    case 'impact':
      extra = interpolate(frame, [0, 7], [1.1, 1], {...clamp, easing: easeOut});
      flash = interpolate(frame, [0, 4], [0.22, 0], {...clamp, easing: easeIn});
      break;
    case 'fade':
    case 'lightSweep':
      opacity = interpolate(frame, [0, shot.overlap], [0, 1], {...clamp, easing: easeInOut});
      break;
    case 'maskWipe':
      clipPath = maskWipeClip(p);
      break;
    case 'whip':
      tx = interpolate(p, [0, 1], [38, 0], {...clamp, easing: easeOut});
      dirBlur = interpolate(frame, [0, shot.overlap + 3], [50, 0], {...clamp, easing: easeOut});
      opacity = interpolate(frame, [0, 2], [0, 1], clamp);
      break;
    default:
      break;
  }

  const v = cinematicZoom(frame, total, shot.cam, extra);
  const trimBefore = Math.max(0, Math.round(shot.pre * fps - shot.overlap * shot.rate));
  const fid = `whip-${shot.id}`;
  const bgScale = interpolate(frame, [0, total], [1.05, 1.1], clamp);

  return (
    <AbsoluteFill style={{opacity, clipPath, translate: `${tx}% 0px`}}>
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <filter id={fid} x="-10%" y="0%" width="120%" height="100%">
          <feGaussianBlur stdDeviation={`${dirBlur} 0`} />
        </filter>
      </svg>
      <AbsoluteFill style={{overflow: 'hidden', background: C.ink}}>
        <Video
          src={staticFile(`dayone/shots/${shot.id}_bg.mp4`)}
          trimBefore={trimBefore}
          playbackRate={shot.rate}
          muted
          name={`${shot.id} fondo`}
          style={{position: 'absolute', inset: 0, width: 1080, height: 1920, scale: String(bgScale), filter: 'brightness(0.55) saturate(1.1)'}}
        />
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: WIN.top,
          width: WIN.width,
          height: WIN.height,
          overflow: 'hidden',
          WebkitMaskImage: MASK,
          maskImage: MASK,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            filter: [dirBlur > 0.5 ? `url(#${fid})` : '', 'contrast(1.05) saturate(1.05)'].join(' ').trim(),
          }}
        >
          <Video
            src={staticFile(`dayone/shots/${shot.id}.mp4`)}
            trimBefore={trimBefore}
            playbackRate={shot.rate}
            muted
            name={shot.id}
            style={{position: 'absolute', left: v.left, top: v.top, width: v.width, height: v.height}}
          />
        </div>
        {shot.spotlight ? (
          <AbsoluteFill
            style={{background: 'radial-gradient(ellipse 48% 52% at 50% 55%, rgba(11,16,32,0) 45%, rgba(11,16,32,0.5) 100%)'}}
          />
        ) : null}
        {flash > 0 ? <AbsoluteFill style={{background: C.white, opacity: flash, mixBlendMode: 'screen'}} /> : null}
      </div>
    </AbsoluteFill>
  );
};
