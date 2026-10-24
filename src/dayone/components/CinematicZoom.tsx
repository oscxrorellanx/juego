import {interpolate} from 'remotion';
import {BASE_SCALE, SRC, WIN} from '../data/palette';
import {clamp, easeInOut} from './motion';

// Cámara simulada: push-in / pull-back / paneo sobre la grabación original.
// Devuelve la posición y el tamaño del vídeo dentro de la banda, sin salir nunca
// de la zona útil (así no aparecen los bordes ni la interfaz de Roblox).
export const cinematicZoom = (
  frame: number,
  total: number,
  cam: {fx: [number, number]; fy: [number, number]; zoom: [number, number]},
  extraZoom = 1,
) => {
  const k = (r: [number, number]) => interpolate(frame, [0, total], r, {...clamp, easing: easeInOut});
  const scale = BASE_SCALE * k(cam.zoom) * extraZoom;
  const {x0, x1, y0, y1} = SRC.safe;
  const left = Math.min(-x0 * scale, Math.max(WIN.width - x1 * scale, WIN.width / 2 - k(cam.fx) * scale));
  const top = Math.min(-y0 * scale, Math.max(WIN.height - y1 * scale, WIN.height / 2 - k(cam.fy) * scale));
  return {left, top, width: SRC.width * scale, height: SRC.height * scale};
};
