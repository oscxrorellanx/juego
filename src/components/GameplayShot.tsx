import {Video} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {HANDLE_SECONDS, Shot} from '../data/shots';
import {BASE_SCALE, SOURCE, WINDOW} from '../styles/palette';
import {clamp, easeIn, easeInOut, easeOut, lerp} from './anim';

const GRADES: Record<NonNullable<Shot['grade']>, string> = {
  // Corrección moderada: conserva el aspecto original del juego.
  neutral: 'contrast(1.05) saturate(1.06) brightness(1.01)',
  warm: 'contrast(1.07) saturate(1.05) brightness(1.02) sepia(0.05)',
  cool: 'contrast(1.05) saturate(1.02) hue-rotate(-4deg)',
};

// Fundido suave (curva) en los bordes superior e inferior de la ventana.
const F = WINDOW.feather;
const H = WINDOW.height;
const WINDOW_MASK = `linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0.12) ${F * 0.25}px, rgba(0,0,0,0.45) ${F * 0.5}px, rgba(0,0,0,0.85) ${F * 0.78}px, black ${F}px, black ${H - F}px, rgba(0,0,0,0.85) ${H - F * 0.78}px, rgba(0,0,0,0.45) ${H - F * 0.5}px, rgba(0,0,0,0.12) ${H - F * 0.25}px, rgba(0,0,0,0) ${H}px)`;

// Un plano de gameplay: fondo desenfocado a pantalla completa + banda nítida
// con movimiento de cámara simulado (push-in, pull-back, paneo) y su transición de entrada.
export const GameplayShot: React.FC<{shot: Shot}> = ({shot}) => {
  const frame = useCurrentFrame(); // 0 = inicio del solape de entrada
  const {fps} = useVideoConfig();
  const total = shot.durationInFrames + shot.overlap;
  const {camera, overlap, transitionIn} = shot;

  // --- Cámara (interpolada en toda la duración del plano)
  const cam = (r: [number, number]) => interpolate(frame, [0, total], r, {...clamp, easing: easeInOut});
  let zoom = cam(camera.zoom);
  const fx = cam(camera.fx);
  const fy = cam(camera.fy);

  // --- Transición de entrada
  const p = overlap > 0 ? interpolate(frame, [0, overlap], [0, 1], clamp) : 1;
  let opacity = 1;
  let clipPath: string | undefined;
  let translateX = 0;
  let dirBlur = 0;
  let blur = 0;
  let flash = 0;

  switch (transitionIn) {
    case 'fadeFromBlack':
      opacity = lerp(frame, [0, 8], [0, 1]);
      zoom *= lerp(frame, [0, 14], [1.08, 1]);
      break;
    case 'lightSweep':
      opacity = interpolate(frame, [0, overlap], [0, 1], {...clamp, easing: easeInOut});
      break;
    case 'fade':
      opacity = interpolate(frame, [0, overlap], [0, 1], {...clamp, easing: easeInOut});
      break;
    case 'maskWipe': {
      const a = interpolate(p, [0, 1], [-25, 125], {...clamp, easing: easeInOut});
      clipPath = p >= 1 ? undefined : `polygon(0% 0%, ${a + 25}% 0%, ${a}% 100%, 0% 100%)`;
      break;
    }
    case 'whip':
      translateX = interpolate(p, [0, 1], [42, 0], {...clamp, easing: easeOut});
      dirBlur = interpolate(frame, [0, overlap + 3], [60, 0], {...clamp, easing: easeOut});
      opacity = interpolate(frame, [0, 2], [0, 1], clamp);
      break;
    case 'impact':
      zoom *= lerp(frame, [0, 9], [1.16, 1]);
      flash = interpolate(frame, [0, 5], [0.28, 0], {...clamp, easing: easeIn});
      break;
    case 'depth':
      zoom *= lerp(frame, [0, overlap + 6], [1.38, 1]);
      opacity = interpolate(frame, [0, overlap], [0, 1], {...clamp, easing: easeInOut});
      blur = interpolate(frame, [0, overlap + 4], [10, 0], {...clamp, easing: easeOut});
      break;
    default:
      break;
  }

  // --- Encaje del vídeo dentro de la ventana (sin mostrar fuera del original ni la ayuda de controles)
  const scale = BASE_SCALE * zoom;
  const vw = SOURCE.width * scale;
  const vh = SOURCE.height * scale;
  const left = Math.min(0, Math.max(WINDOW.width - vw, WINDOW.width / 2 - fx * scale));
  const top = Math.min(0, Math.max(WINDOW.height - SOURCE.usableHeight * scale, WINDOW.height / 2 - fy * scale));

  const trimBefore = Math.max(0, Math.round(HANDLE_SECONDS * fps - overlap * shot.playbackRate));
  const filterId = `whip-${shot.id}`;
  const grade = GRADES[shot.grade ?? 'neutral'];

  // Fondo: deriva lenta para dar vida al formato vertical.
  const bgScale = interpolate(frame, [0, total], [1.06, 1.12], clamp);

  return (
    <AbsoluteFill style={{opacity, clipPath, translate: `${translateX}% 0px`}}>
      {/* Desenfoque direccional para el whip pan */}
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <filter id={filterId} x="-10%" y="0%" width="120%" height="100%">
          <feGaussianBlur stdDeviation={`${dirBlur} 0`} />
        </filter>
      </svg>

      {/* Fondo desenfocado (clip pre-desenfocado con ffmpeg) */}
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <Video
          src={staticFile(`shots/${shot.id}_bg.mp4`)}
          trimBefore={trimBefore}
          playbackRate={shot.playbackRate}
          muted
          name={`${shot.id} fondo`}
          style={{
            position: 'absolute',
            width: 1280,
            height: 1920,
            left: -100,
            top: 0,
            scale: String(bgScale),
            filter: 'brightness(0.6) saturate(1.15)',
          }}
        />
      </AbsoluteFill>

      {/* Ventana nítida */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: WINDOW.top,
          width: WINDOW.width,
          height: WINDOW.height,
          overflow: 'hidden',
          WebkitMaskImage: WINDOW_MASK,
          maskImage: WINDOW_MASK,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            filter: [dirBlur > 0.5 ? `url(#${filterId})` : '', blur > 0.2 ? `blur(${blur}px)` : '', grade]
              .filter(Boolean)
              .join(' '),
          }}
        >
          <Video
            src={staticFile(`shots/${shot.id}.mp4`)}
            trimBefore={trimBefore}
            playbackRate={shot.playbackRate}
            muted
            name={shot.id}
            style={{position: 'absolute', left, top, width: vw, height: vh}}
          />
        </div>
        {flash > 0 ? <AbsoluteFill style={{background: '#F5F7FF', opacity: flash, mixBlendMode: 'screen'}} /> : null}
      </div>
    </AbsoluteFill>
  );
};
