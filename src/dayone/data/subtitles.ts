// Subtítulos sincronizados con la voz real: los tiempos salen de la duración medida
// de cada frase generada (voice.generated.ts). También generan el .srt.
import {voiceLines} from './voice.generated';

export type DaySubtitle = {startMs: number; endMs: number; text: string; keys: string[]; hideOnScreen: boolean};

export const daySubtitles: DaySubtitle[] = voiceLines.reduce<DaySubtitle[]>(
  (acc, l) =>
    acc.concat(l.chunks.map((c) => ({startMs: c.startMs, endMs: c.endMs, text: c.text, keys: c.keys, hideOnScreen: l.hideOnScreen}))),
  [],
);
