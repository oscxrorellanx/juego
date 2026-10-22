// Pistas de audio del tráiler.

// Música original sintetizada (tools/audio/generate_audio.py), 45 s, ya sincronizada
// con el montaje: impactos en 0, 18, 23, 34 y 40 s; pausa entre 29 y 34 s.
export const MUSIC = {
  src: 'audio/music.wav',
  volume: 0.82,
  // Volumen de la música mientras habla el narrador (ducking).
  duckedVolume: 0.38,
};

// NARRACIÓN
// Todavía no hay voz grabada. Para añadirla:
//  1) Graba una frase por subtítulo (ver Narracion.txt) y guárdalas como
//     public/audio/voz/01.wav, 02.wav ... 15.wav (o .mp3, cambiando `ext`).
//  2) Cambia `enabled` a true.
// Cada archivo empieza en el startMs del subtítulo correspondiente y la música
// baja automáticamente mientras suena la voz.
export const NARRATION = {
  enabled: false,
  folder: 'audio/voz',
  ext: 'wav',
  volume: 1,
};

export type SfxName = 'impact' | 'whoosh' | 'whip' | 'riser' | 'shimmer' | 'hit' | 'tick';

// Efectos de sonido (fotograma en el que empiezan).
export const SFX: {frame: number; name: SfxName; volume: number}[] = [
  // Escena 1 — gancho
  {frame: 0, name: 'impact', volume: 0.55},
  {frame: 2, name: 'whoosh', volume: 0.35},
  {frame: 22, name: 'hit', volume: 0.35},
  // 1→2 barrido de luz
  {frame: 84, name: 'shimmer', volume: 0.3},
  {frame: 86, name: 'whoosh', volume: 0.3},
  // 2→3 máscara
  {frame: 232, name: 'whoosh', volume: 0.32},
  // 3: whip
  {frame: 340, name: 'whip', volume: 0.35},
  // 4: palabras PERSONAJES. SECRETOS. AVENTURAS.
  {frame: 402, name: 'tick', volume: 0.3},
  {frame: 414, name: 'tick', volume: 0.3},
  {frame: 426, name: 'hit', volume: 0.32},
  {frame: 459, name: 'whoosh', volume: 0.25},
  // 5: corte de impacto + profundidad
  {frame: 540, name: 'hit', volume: 0.4},
  {frame: 609, name: 'whoosh', volume: 0.3},
  // 6: montaje
  {frame: 690, name: 'hit', volume: 0.42},
  {frame: 731, name: 'whip', volume: 0.38},
  {frame: 765, name: 'hit', volume: 0.3},
  {frame: 790, name: 'whoosh', volume: 0.3},
  {frame: 825, name: 'hit', volume: 0.42},
  // 7: pausa
  {frame: 960, name: 'riser', volume: 0.22},
  // 8: clímax
  {frame: 1046, name: 'whip', volume: 0.36},
  {frame: 1080, name: 'hit', volume: 0.3},
  {frame: 1119, name: 'shimmer', volume: 0.3},
  // 9: cierre
  {frame: 1214, name: 'shimmer', volume: 0.32},
];
