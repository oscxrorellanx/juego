// Subtítulos sincronizados con la narración (en milisegundos del tráiler).
// La misma tabla genera GameTrailerTikTok.srt (tools/export_srt.ts).
// `keywords`: palabras resaltadas (cian por defecto, dorado si accent: 'gold').
// `hideOnScreen`: se exporta al SRT pero no se dibuja, porque el texto
// promocional en pantalla ya dice lo mismo.

export type SubtitleSegment = {
  startMs: number;
  endMs: number;
  text: string;
  keywords?: string[];
  accent?: 'cyan' | 'gold';
  hideOnScreen?: boolean;
};

export const subtitles: SubtitleSegment[] = [
  {startMs: 300, endMs: 1400, text: '¡Ey, aventureros!', keywords: ['aventureros!']},
  {startMs: 1400, endMs: 2850, text: '¡Miren lo que estoy creando!', keywords: ['creando!']},
  {startMs: 3200, endMs: 5400, text: 'Un mundo lleno de lugares por descubrir,', keywords: ['mundo', 'descubrir,']},
  {startMs: 5500, endMs: 8600, text: 'personajes que conocer y aventuras\nque te esperan en cada rincón.', keywords: ['personajes', 'aventuras']},
  {startMs: 8900, endMs: 10900, text: 'Explora aldeas, recorre caminos,', keywords: ['Explora']},
  {startMs: 11000, endMs: 13200, text: 'adéntrate en lugares misteriosos', keywords: ['misteriosos']},
  {startMs: 13400, endMs: 16200, text: 'y descubre qué secretos\nesconde este mundo.', keywords: ['secretos']},
  {startMs: 18600, endMs: 20700, text: '¡Y esto es solo una pequeña muestra', keywords: ['pequeña', 'muestra']},
  {startMs: 20700, endMs: 22800, text: 'de todo lo que puedes encontrar!', keywords: ['encontrar!']},
  {startMs: 23400, endMs: 26400, text: 'Cada zona tiene algo nuevo que explorar…', keywords: ['nuevo'], accent: 'gold'},
  {startMs: 29500, endMs: 32100, text: '…y quién sabe qué te espera\nmás adelante.', keywords: ['más', 'adelante.']},
  {startMs: 32300, endMs: 33900, text: '¿Te atreves a descubrirlo?', keywords: ['descubrirlo?'], accent: 'gold'},
  {startMs: 34800, endMs: 37900, text: '¡Prepárate, porque esta aventura\napenas comienza!', keywords: ['aventura', 'comienza!'], accent: 'gold'},
  {startMs: 40400, endMs: 42500, text: 'Sígueme para ver cómo evoluciona el juego', hideOnScreen: true},
  {startMs: 42500, endMs: 44600, text: 'y no perderte las próximas novedades.', hideOnScreen: true},
];
