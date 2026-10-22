// Genera el .srt a partir de src/data/subtitles.ts (misma fuente que el vídeo).
// Uso: node tools/export_srt.ts entregables/GameTrailerTikTok.srt
import {writeFileSync} from 'node:fs';
import {subtitles} from '../src/data/subtitles.ts';

const ts = (ms: number) => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const r = ms % 1000;
  const p = (n: number, l = 2) => String(n).padStart(l, '0');
  return `${p(h)}:${p(m)}:${p(s)},${p(r, 3)}`;
};

const out = subtitles
  .map((s, i) => `${i + 1}\n${ts(s.startMs)} --> ${ts(s.endMs)}\n${s.text}\n`)
  .join('\n');
writeFileSync(process.argv[2] ?? 'GameTrailerTikTok.srt', out, 'utf8');
console.log('SRT:', subtitles.length, 'segmentos');
