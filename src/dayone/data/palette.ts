// Paleta, tipografía y medidas del tráiler RobloxDayOneTrailer.
export const C = {
  white: '#F7F9FF', // títulos generales
  ink: '#0B1020', // sombras, velos, fondos
  gold: '#F4C76A', // DÍA UNO, YO ESTUVE AQUÍ, mensaje emocional
  blue: '#4DA9FF', // gráficos secundarios
  cyan: '#64E5FF', // palabras relacionadas con el juego
} as const;

export const FONT = {
  display: '"Archivo Black", "Montserrat", "Inter", sans-serif',
  text: '"Inter", sans-serif',
} as const;

export const VIDEO = {width: 1080, height: 1920, fps: 30, durationInFrames: 1140} as const;

// Banda de gameplay (la grabación es 1364 × 766, horizontal).
export const WIN = {top: 500, width: 1080, height: 860, feather: 120} as const;

// Grabación original y zona útil sin la interfaz de Roblox/HUD
// (corazones, reloj, iconos de habilidades, minimapa, gemas y ayuda de controles).
export const SRC = {width: 1364, height: 766, safe: {x0: 330, x1: 1040, y0: 110, y1: 725}} as const;
export const BASE_SCALE = 1.52; // la banda muestra 710 × 566 px del original

// Zonas seguras para TikTok.
export const SAFE = {side: 100, titleY: 300, subtitleTop: 1392} as const;

// Mostrar la etiqueta "CREADOR" sobre el personaje solo si se confirma que es el avatar del creador.
export const SHOW_CREATOR_TAG = false;
