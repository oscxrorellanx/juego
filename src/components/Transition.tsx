import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {palette} from '../styles/palette';
import {clamp, easeInOut} from './anim';

// Biblioteca de transiciones.
// La mayor parte del efecto se aplica en la entrada de cada plano (GameplayShot,
// según `transitionIn`). Aquí están las capas que acompañan al corte:
//
//  A cut         -> corte limpio (sin capa)
//  B lightSweep  -> <LightSweep> (archivo propio)
//  C maskWipe    -> <MaskWipeEdge>: filo luminoso que acompaña a la máscara diagonal
//  D whip        -> desenfoque direccional dentro de GameplayShot
//  E fade        -> fundido en GameplayShot
//  F impact      -> cambio de escala + destello mínimo en GameplayShot (+ golpe sonoro)

// Filo de la máscara diagonal: misma geometría que el clipPath del plano entrante.
export const MaskWipeEdge: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, duration], [0, 1], clamp);
  const a = interpolate(p, [0, 1], [-25, 125], {...clamp, easing: easeInOut});
  const opacity = interpolate(p, [0, 0.15, 0.85, 1], [0, 1, 1, 0], clamp);
  // Línea entre (a+25%, 0) y (a%, 100%) del lienzo 1080 × 1920.
  const x0 = ((a + 25) / 100) * 1080;
  const x1 = (a / 100) * 1080;
  const angle = Math.atan2(1920, x1 - x0) * (180 / Math.PI);
  const len = Math.hypot(x1 - x0, 1920);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      <div
        style={{
          position: 'absolute',
          left: x0,
          top: 0,
          width: len,
          height: 4,
          transformOrigin: '0 50%',
          rotate: `${angle}deg`,
          background: `linear-gradient(90deg, ${palette.cyan}00, ${palette.cyan} 30%, #ffffff 50%, ${palette.cyan} 70%, ${palette.cyan}00)`,
          boxShadow: `0 0 24px 6px ${palette.cyan}88`,
        }}
      />
    </AbsoluteFill>
  );
};
