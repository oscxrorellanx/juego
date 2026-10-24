// Línea de tiempo del tráiler RobloxDayOneTrailer (30 fps, 1140 fotogramas = 38 s).
// Los clips se cortan con tools/cut_dayone.py (misma tabla de inicio/duración/velocidad).

export type Trans = 'cut' | 'impact' | 'fade' | 'maskWipe' | 'whip' | 'lightSweep';

export type DayShot = {
  id: string;
  scene: number;
  from: number;
  frames: number;
  srcStart: number; // segundo del original (documentación)
  rate: number; // velocidad de reproducción (cámara lenta < 1)
  pre: number; // segundos de margen antes del inicio en el clip cortado
  trans: Trans;
  overlap: number;
  cam: {fx: [number, number]; fy: [number, number]; zoom: [number, number]};
  label?: string;
  spotlight?: boolean; // oscurecimiento periférico para destacar al personaje
};

export const dayShots: DayShot[] = [
  // 1 — GANCHO (0–3 s): la criatura de hélice se acerca, a cámara lenta. Zoom 100 % → 108 %.
  {id: 'd1', scene: 1, from: 0, frames: 90, srcStart: 24.8, rate: 0.6, pre: 0.5, trans: 'impact', overlap: 0,
    cam: {fx: [640, 620], fy: [405, 420], zoom: [1.0, 1.08]}},
  // 2 — LA PROMESA (3–7 s): la llanura, movimiento lento.
  {id: 'd2', scene: 2, from: 90, frames: 120, srcStart: 0.0, rate: 1, pre: 0, trans: 'fade', overlap: 6,
    cam: {fx: [682, 690], fy: [420, 410], zoom: [1.02, 1.1]}},
  // 3 — PRESENTACIÓN (7–13 s)
  {id: 'd3a', scene: 3, from: 210, frames: 60, srcStart: 4.2, rate: 1, pre: 0.5, trans: 'maskWipe', overlap: 10,
    cam: {fx: [700, 670], fy: [400, 405], zoom: [1.04, 1.1]}, label: 'LLANURA ÁMBAR'},
  {id: 'd3b', scene: 3, from: 270, frames: 60, srcStart: 6.6, rate: 1, pre: 0.5, trans: 'cut', overlap: 0,
    cam: {fx: [640, 710], fy: [420, 420], zoom: [1.08, 1.08]}},
  {id: 'd3c', scene: 3, from: 330, frames: 60, srcStart: 16.6, rate: 1, pre: 0.5, trans: 'maskWipe', overlap: 8,
    cam: {fx: [682, 682], fy: [390, 375], zoom: [1.0, 1.12]}},
  // 4 — INVITACIÓN (13–19 s): montaje de lo que se puede hacer.
  {id: 'd4a', scene: 4, from: 390, frames: 30, srcStart: 9.6, rate: 1, pre: 0.5, trans: 'whip', overlap: 6,
    cam: {fx: [682, 690], fy: [420, 420], zoom: [1.1, 1.12]}, label: 'EXPLORA'},
  {id: 'd4b', scene: 4, from: 420, frames: 30, srcStart: 10.7, rate: 1, pre: 0.5, trans: 'impact', overlap: 0,
    cam: {fx: [682, 682], fy: [430, 430], zoom: [1.0, 1.04]}},
  {id: 'd4c', scene: 4, from: 450, frames: 30, srcStart: 11.75, rate: 1, pre: 0.5, trans: 'cut', overlap: 0,
    cam: {fx: [682, 682], fy: [380, 380], zoom: [1.0, 1.05]}},
  {id: 'd4d', scene: 4, from: 480, frames: 45, srcStart: 20.8, rate: 1, pre: 0.5, trans: 'maskWipe', overlap: 6,
    cam: {fx: [682, 682], fy: [390, 400], zoom: [1.12, 1.04]}, label: 'DESCUBRE'},
  {id: 'd4e', scene: 4, from: 525, frames: 45, srcStart: 23.0, rate: 1, pre: 0.5, trans: 'impact', overlap: 0,
    cam: {fx: [682, 682], fy: [420, 420], zoom: [1.0, 1.1]}},
  // 5 — CONEXIÓN PERSONAL (19–25 s)
  {id: 'd5a', scene: 5, from: 570, frames: 30, srcStart: 15.85, rate: 0.6, pre: 0.5, trans: 'lightSweep', overlap: 8,
    cam: {fx: [690, 690], fy: [470, 470], zoom: [1.1, 1.18]}, spotlight: true},
  {id: 'd5b', scene: 5, from: 600, frames: 105, srcStart: 31.0, rate: 0.629, pre: 0.5, trans: 'cut', overlap: 0,
    cam: {fx: [600, 620], fy: [470, 470], zoom: [1.12, 1.2]}, spotlight: true},
  {id: 'd5c', scene: 5, from: 705, frames: 45, srcStart: 15.0, rate: 0.5, pre: 0.5, trans: 'fade', overlap: 8,
    cam: {fx: [682, 682], fy: [500, 500], zoom: [1.0, 1.04]}, label: 'EN DESARROLLO'},
  // 6 — MOMENTO EMOCIONAL (25–32 s): cámara lenta.
  {id: 'd6a', scene: 6, from: 750, frames: 135, srcStart: 28.2, rate: 0.444, pre: 0.5, trans: 'fade', overlap: 14,
    cam: {fx: [650, 660], fy: [385, 375], zoom: [1.0, 1.1]}},
  {id: 'd6b', scene: 6, from: 885, frames: 75, srcStart: 19.0, rate: 0.572, pre: 0.5, trans: 'fade', overlap: 12,
    cam: {fx: [682, 682], fy: [380, 390], zoom: [1.1, 1.02]}},
  // 7 — CIERRE VIRAL (32–38 s)
  {id: 'd7', scene: 7, from: 960, frames: 180, srcStart: 33.2, rate: 0.45, pre: 0.5, trans: 'impact', overlap: 0,
    cam: {fx: [640, 650], fy: [440, 445], zoom: [1.06, 1.14]}},
];

export type SfxName = 'impact' | 'whoosh' | 'whip' | 'hit' | 'pop' | 'sparkle' | 'riser';

export const daySfx: {frame: number; name: SfxName; volume: number}[] = [
  {frame: 0, name: 'impact', volume: 0.5},
  {frame: 1, name: 'whoosh', volume: 0.28},
  {frame: 90, name: 'hit', volume: 0.35},
  {frame: 150, name: 'sparkle', volume: 0.32},
  {frame: 200, name: 'whoosh', volume: 0.26},
  {frame: 322, name: 'whoosh', volume: 0.22},
  {frame: 384, name: 'whip', volume: 0.32},
  {frame: 392, name: 'hit', volume: 0.3},
  {frame: 420, name: 'hit', volume: 0.22},
  {frame: 474, name: 'whoosh', volume: 0.2},
  {frame: 525, name: 'hit', volume: 0.25},
  {frame: 563, name: 'sparkle', volume: 0.22},
  {frame: 896, name: 'sparkle', volume: 0.35},
  {frame: 954, name: 'whoosh', volume: 0.16},
  {frame: 999, name: 'pop', volume: 0.4},
  {frame: 1019, name: 'pop', volume: 0.36},
  {frame: 1050, name: 'sparkle', volume: 0.38},
];
