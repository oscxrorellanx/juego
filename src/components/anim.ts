import {Easing, interpolate} from 'remotion';

// Utilidades deterministas: todo depende del número de fotograma.
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Curvas suaves sin rebote.
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.45, 0, 0.2, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);

export const lerp = (frame: number, range: [number, number], out: [number, number], easing = easeOut) =>
  interpolate(frame, range, out, {...clamp, easing});
