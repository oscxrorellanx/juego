// Lista de planos del tráiler.
//
// Cada clip de public/shots/ se cortó del gameplay original con medio segundo
// extra al principio y al final (HANDLE_SECONDS) para poder solapar transiciones.
// Para cambiar un plano: vuelve a cortar el clip (tools/cut_shots.py) y ajusta aquí.
//
// Tiempos en fotogramas del tráiler (30 fps). srcStart = segundo del gameplay original
// donde empieza la parte visible del plano.

export type TransitionKind =
  | 'none' // primer plano
  | 'fadeFromBlack' // entrada desde negro (gancho)
  | 'cut' // A — corte limpio
  | 'lightSweep' // B — barrido de luz
  | 'maskWipe' // C — máscara diagonal
  | 'whip' // D — whip pan con desenfoque direccional
  | 'fade' // E — fundido cinematográfico
  | 'impact' // F — corte de impacto (cambio de escala + golpe)
  | 'depth'; // transición con profundidad simulada (zoom a través)

export type Camera = {
  // Punto de interés en píxeles del original (1184 × 478).
  fx: [number, number];
  fy: [number, number];
  // Zoom digital (1 = la banda completa).
  zoom: [number, number];
};

export type Shot = {
  id: string;
  scene: number;
  from: number;
  durationInFrames: number;
  srcStart: number;
  playbackRate: number;
  transitionIn: TransitionKind;
  overlap: number; // fotogramas que el plano entra antes del corte (transición)
  camera: Camera;
  label?: string; // etiqueta editorial (solo nombres que aparecen en el juego)
  grade?: 'neutral' | 'warm' | 'cool';
};

export const HANDLE_SECONDS = 0.5;

export const shots: Shot[] = [
  // ESCENA 1 — Gancho (0–3 s): camino hacia la puerta de Mossbrook, push-in.
  {id: 's1', scene: 1, from: 0, durationInFrames: 90, srcStart: 75.3, playbackRate: 1, transitionIn: 'fadeFromBlack', overlap: 0,
    camera: {fx: [592, 596], fy: [215, 205], zoom: [1.0, 1.24]}},

  // ESCENA 2 — Presentación del mundo (3–8 s): panorámica del estanque a la aldea.
  {id: 's2', scene: 2, from: 90, durationInFrames: 150, srcStart: 48.5, playbackRate: 1, transitionIn: 'lightSweep', overlap: 8,
    camera: {fx: [560, 640], fy: [215, 225], zoom: [1.1, 1.14]}, label: 'ALDEA MUSGOSA'},

  // ESCENA 3 — Exploración (8–13 s): tres caminos distintos.
  {id: 's3a', scene: 3, from: 240, durationInFrames: 60, srcStart: 85.6, playbackRate: 1, transitionIn: 'maskWipe', overlap: 10,
    camera: {fx: [592, 592], fy: [230, 220], zoom: [1.04, 1.15]}, label: 'LLANURA ÁMBAR'},
  {id: 's3b', scene: 3, from: 300, durationInFrames: 45, srcStart: 94.0, playbackRate: 1, transitionIn: 'cut', overlap: 0,
    camera: {fx: [610, 595], fy: [235, 225], zoom: [1.16, 1.06]}},
  {id: 's3c', scene: 3, from: 345, durationInFrames: 45, srcStart: 126.0, playbackRate: 1, transitionIn: 'whip', overlap: 6,
    camera: {fx: [592, 592], fy: [215, 200], zoom: [1.0, 1.2]}},

  // ESCENA 4 — Personajes y detalles (13–18 s).
  {id: 's4a', scene: 4, from: 390, durationInFrames: 75, srcStart: 61.0, playbackRate: 1, transitionIn: 'fade', overlap: 12,
    camera: {fx: [592, 588], fy: [250, 262], zoom: [1.1, 1.2]}, label: 'TENDERA MARA'},
  {id: 's4b', scene: 4, from: 465, durationInFrames: 75, srcStart: 79.0, playbackRate: 1, transitionIn: 'maskWipe', overlap: 8,
    camera: {fx: [600, 596], fy: [262, 270], zoom: [1.14, 1.24]}, label: 'GUARDIÁN TOMO · MOSSBROOK'},

  // ESCENA 5 — Cambio de ritmo (18–23 s): nueva zona volcánica.
  {id: 's5a', scene: 5, from: 540, durationInFrames: 75, srcStart: 132.6, playbackRate: 1, transitionIn: 'impact', overlap: 0,
    camera: {fx: [592, 592], fy: [200, 205], zoom: [1.0, 1.1]}, label: 'PASO DE CENIZA', grade: 'warm'},
  {id: 's5b', scene: 5, from: 615, durationInFrames: 75, srcStart: 173.0, playbackRate: 1, transitionIn: 'depth', overlap: 8,
    camera: {fx: [600, 592], fy: [225, 215], zoom: [1.12, 1.0]}, label: 'FORJA BRASA', grade: 'warm'},

  // ESCENA 6 — Montaje de impacto (23–29 s): cinco fragmentos.
  {id: 's6a', scene: 6, from: 690, durationInFrames: 45, srcStart: 135.2, playbackRate: 1, transitionIn: 'impact', overlap: 0,
    camera: {fx: [600, 590], fy: [245, 240], zoom: [1.26, 1.14]}, grade: 'warm'},
  {id: 's6b', scene: 6, from: 735, durationInFrames: 30, srcStart: 150.3, playbackRate: 1, transitionIn: 'whip', overlap: 5,
    camera: {fx: [592, 600], fy: [235, 235], zoom: [1.0, 1.06]}, grade: 'warm'},
  {id: 's6c', scene: 6, from: 765, durationInFrames: 30, srcStart: 164.2, playbackRate: 1, transitionIn: 'cut', overlap: 0,
    camera: {fx: [600, 600], fy: [255, 250], zoom: [1.34, 1.28]}, grade: 'warm'},
  {id: 's6d', scene: 6, from: 795, durationInFrames: 30, srcStart: 213.9, playbackRate: 1, transitionIn: 'maskWipe', overlap: 6,
    camera: {fx: [640, 650], fy: [240, 240], zoom: [1.1, 1.2]}, grade: 'warm'},
  {id: 's6e', scene: 6, from: 825, durationInFrames: 45, srcStart: 219.0, playbackRate: 1, transitionIn: 'impact', overlap: 0,
    camera: {fx: [592, 592], fy: [240, 235], zoom: [1.0, 1.12]}, grade: 'warm'},

  // ESCENA 7 — Misterio y expectativa (29–34 s): la puerta rúnica.
  {id: 's7', scene: 7, from: 870, durationInFrames: 150, srcStart: 179.0, playbackRate: 1, transitionIn: 'fade', overlap: 14,
    camera: {fx: [592, 596], fy: [225, 215], zoom: [1.0, 1.24]}, grade: 'warm'},

  // ESCENA 8 — Clímax final (34–40 s).
  {id: 's8a', scene: 8, from: 1020, durationInFrames: 30, srcStart: 303.7, playbackRate: 1, transitionIn: 'impact', overlap: 0,
    camera: {fx: [592, 592], fy: [245, 240], zoom: [1.22, 1.1]}, grade: 'warm'},
  {id: 's8b', scene: 8, from: 1050, durationInFrames: 30, srcStart: 204.6, playbackRate: 1, transitionIn: 'whip', overlap: 5,
    camera: {fx: [560, 575], fy: [240, 240], zoom: [1.02, 1.12]}, grade: 'warm'},
  {id: 's8c', scene: 8, from: 1080, durationInFrames: 45, srcStart: 257.6, playbackRate: 1, transitionIn: 'cut', overlap: 0,
    camera: {fx: [600, 600], fy: [290, 300], zoom: [1.08, 1.16]}, label: 'ESPADA TEMPLADA', grade: 'warm'},
  {id: 's8d', scene: 8, from: 1125, durationInFrames: 75, srcStart: 385.5, playbackRate: 1, transitionIn: 'lightSweep', overlap: 6,
    camera: {fx: [592, 592], fy: [230, 215], zoom: [1.04, 1.22]}, grade: 'warm'},

  // ESCENA 9 — Cierre (40–45 s): la aldea, a cámara lenta (0,6×).
  {id: 's9', scene: 9, from: 1200, durationInFrames: 150, srcStart: 15.3, playbackRate: 0.6, transitionIn: 'fade', overlap: 10,
    camera: {fx: [592, 600], fy: [215, 210], zoom: [1.06, 1.18]}},
];
