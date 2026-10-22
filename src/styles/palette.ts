// Paleta y sistema tipográfico del tráiler.
export const palette = {
  ink: '#0B1020', // negro azulado: sombras, máscaras, fondos de apoyo
  paper: '#F5F7FF', // blanco suave: la mayoría de títulos
  cyan: '#56D9FF', // palabras clave
  deep: '#173A63', // gráficos secundarios
  gold: '#F3C969', // impactos puntuales
} as const;

export const fonts = {
  display: '"Archivo Black", "Inter", sans-serif', // titulares 800–900 visuales
  text: '"Inter", sans-serif', // subtítulos y texto secundario
} as const;

// Composición vertical 1080 × 1920.
export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 1350,
} as const;

// "Ventana" de gameplay: la grabación original es 1184 × 478 (muy panorámica),
// así que se presenta como una banda cinematográfica a todo el ancho,
// con el mismo plano desenfocado detrás llenando el formato vertical.
export const WINDOW = {
  top: 520,
  width: 1080,
  height: 780,
  feather: 130, // fundido suave en los bordes superior e inferior
} as const;

// Fuente original y zona útil (se excluye la franja inferior con la ayuda de controles).
export const SOURCE = {
  width: 1184,
  height: 478,
  usableHeight: 450,
} as const;

// Escala base: la ventana muestra 448 px de alto del original.
export const BASE_SCALE = WINDOW.height / 448;

// Zonas de texto (seguras para TikTok).
export const LAYOUT = {
  sideMargin: 100,
  titleCenterY: 330, // centro del bloque de titulares, sobre la ventana
  subtitleTop: 1338, // subtítulos debajo de la ventana, por encima de la UI de TikTok
} as const;
