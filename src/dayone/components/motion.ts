import {Easing, interpolate, spring} from 'remotion';

// Curvas compartidas. Todo depende del fotograma: render determinista.
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.45, 0, 0.2, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);

// Entrada con spring sin rebote (damping alto), normalizada a `frames` fotogramas.
export const enter = (frame: number, fps: number, delay = 0, frames = 12) =>
  spring({frame: frame - delay, fps, config: {damping: 200, mass: 0.6}, durationInFrames: frames});

// Salida: 0 → 1 a lo largo de `frames` fotogramas a partir de `at`.
export const exit = (frame: number, at: number | undefined, frames = 8) =>
  at === undefined ? 0 : interpolate(frame, [at, at + frames], [0, 1], {...clamp, easing: easeIn});

export const textShadow = '0 6px 26px rgba(11,16,32,0.6), 0 2px 5px rgba(11,16,32,0.65)';
