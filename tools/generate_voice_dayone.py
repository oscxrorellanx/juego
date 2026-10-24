"""
Genera la narración con IA del tráiler RobloxDayOneTrailer.

Motor: Kokoro v1.0 (modelo de voz neuronal, licencia Apache 2.0) ejecutado en local con
kokoro-onnx. Voz: em_alex (masculina), fonética de espeak-ng en español latinoamericano
("es-419", con seseo).

Requisitos:
  pip install kokoro-onnx soundfile scipy numpy
  Modelos (release oficial de kokoro-onnx en GitHub, "model-files-v1.0"):
    kokoro-v1.0.onnx y voices-v1.0.bin

Uso:
  python3 tools/generate_voice_dayone.py /ruta/a/carpeta_con_modelos

Salida:
  public/dayone/audio/voz/NN.wav      una frase por archivo (48 kHz)
  public/dayone/audio/voz_completa.wav  pista de voz completa de 38 s ya colocada
  src/dayone/data/voice.generated.ts   tiempos reales de cada frase y de cada subtítulo
"""
import json
import os
import sys

import numpy as np
import soundfile as sf
from scipy.signal import butter, resample_poly, sosfilt

from kokoro_onnx import Kokoro

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
OUT_DIR = os.path.join(ROOT, 'public', 'dayone', 'audio', 'voz')
TS_OUT = os.path.join(ROOT, 'src', 'dayone', 'data', 'voice.generated.ts')
SR = 48000
TOTAL = 38.0
VOICE = 'em_alex'
LANG = 'es-419'

# Guion condensado (el completo medía 38,7 s con pausas mínimas y no cabía en 38 s).
# target: segundo en el que debería empezar la frase; speed: ritmo de la interpretación.
# chunks: cómo se reparte en subtítulos (máx. 2 líneas); keys: palabras clave doradas.
LINES = [
    dict(text='Imagínate que este juego se vuelva famoso...', target=0.25, speed=0.95,
         chunks=[('Imagínate que este juego\nse vuelva famoso…', ['famoso'])]),
    dict(text='y tú puedas decir: ¡Yo estuve desde el principio!', target=3.35, speed=0.95,
         chunks=[('…y tú puedas decir:', []), ('«¡Yo estuve desde el principio!»', ['desde el principio'])]),
    dict(text='Estoy creando mi propio RPG en Roblox,', target=7.05, speed=1.05,
         chunks=[('Estoy creando mi propio RPG\nen Roblox,', ['mi propio RPG'])]),
    dict(text='¡y quiero que formes parte de esta aventura!', target=9.6, speed=1.05,
         chunks=[('¡y quiero que formes parte\nde esta aventura!', ['formes parte'])]),
    dict(text='Ya puedes venir a explorar y probar lo que llevo construido.', target=13.1, speed=1.05,
         chunks=[('Ya puedes venir a explorar', ['explorar']), ('y probar lo que llevo construido.', ['probar'])]),
    dict(text='¡Y yo también estaré jugando con ustedes!', target=19.1, speed=1.0,
         chunks=[('¡Y yo también estaré\njugando con ustedes!', ['jugando con ustedes'])]),
    dict(text='Quiero escuchar tus ideas y mejorar el juego junto a la comunidad.', target=21.7, speed=1.04,
         chunks=[('Quiero escuchar tus ideas', ['ideas']), ('y mejorar el juego\njunto a la comunidad.', ['comunidad'])]),
    dict(text='Y si algún día llegamos lejos,', target=25.3, speed=0.92,
         chunks=[('Y si algún día llegamos lejos,', [])]),
    dict(text='recordaré a quienes estuvieron desde el día uno.', target=27.35, speed=0.92,
         chunks=[('recordaré a quienes estuvieron', []), ('desde el día uno.', ['día uno'])]),
    dict(text='Entra, pruébalo, deja tu like, sígueme y comenta: ¡Yo estuve aquí!', target=32.3, speed=1.08,
         chunks=[('Entra, pruébalo, deja tu like,', ['like']), ('sígueme y comenta:', []), ('«¡YO ESTUVE AQUÍ!»', ['YO ESTUVE AQUÍ'])],
         hide=True),
    dict(text='¡Nos vemos dentro del juego!', target=35.95, speed=1.08,
         chunks=[('¡Nos vemos dentro del juego!', ['dentro del juego'])]),
]


def trim(a, sr):
    # Recorta el silencio inicial con decisión y el final con suavidad:
    # las últimas sílabas (p. ej. "-quí") son débiles y no deben cortarse.
    head = np.where(np.abs(a) > 0.012)[0]
    tail = np.where(np.abs(a) > 0.003)[0]
    if len(head) == 0:
        return a
    s = max(0, head[0] - int(0.03 * sr))
    e = min(len(a), tail[-1] + int(0.12 * sr))
    return a[s:e]


def main():
    models = sys.argv[1] if len(sys.argv) > 1 else '.'
    k = Kokoro(os.path.join(models, 'kokoro-v1.0.onnx'), os.path.join(models, 'voices-v1.0.bin'))
    os.makedirs(OUT_DIR, exist_ok=True)
    hp = butter(2, 75, 'high', fs=SR, output='sos')
    track = np.zeros(int(TOTAL * SR))
    timeline = []
    prev_end = 0.0
    for i, line in enumerate(LINES):
        a, sr = k.create(line['text'], voice=VOICE, speed=line['speed'], lang=LANG)
        a = trim(np.asarray(a, dtype=np.float64), sr)
        a = resample_poly(a, SR, sr)
        a = sosfilt(hp, a)
        a = a / (np.max(np.abs(a)) + 1e-9) * 0.7  # pico -3 dBFS
        # micro-fundidos para evitar clics
        f = int(0.006 * SR)
        a[:f] *= np.linspace(0, 1, f)
        a[-f:] *= np.linspace(1, 0, f)
        dur = len(a) / SR
        start = max(line['target'], prev_end + 0.2)
        end = start + dur
        if end > TOTAL - 0.15:
            raise SystemExit(f'La frase {i + 1} termina en {end:.2f}s y no cabe en {TOTAL}s')
        prev_end = end
        sf.write(os.path.join(OUT_DIR, f'{i + 1:02d}.wav'), a.astype(np.float32), SR, subtype='PCM_16')
        s0 = int(start * SR)
        track[s0:s0 + len(a)] += a

        # Reparto de subtítulos dentro de la frase: proporcional a las letras de cada trozo.
        weights = [max(1, sum(ch.isalnum() for ch in c[0])) for c in line['chunks']]
        tot = sum(weights)
        t = start
        chunks = []
        for (txt, keys), w in zip(line['chunks'], weights):
            d = dur * w / tot
            chunks.append(dict(text=txt, keys=keys, startMs=round(t * 1000), endMs=round((t + d) * 1000)))
            t += d
        timeline.append(dict(file=f'{i + 1:02d}.wav', text=line['text'], startMs=round(start * 1000),
                             endMs=round(end * 1000), hideOnScreen=bool(line.get('hide')), chunks=chunks))
        print(f'{i + 1:02d}  {start:6.2f}–{end:6.2f}s  ({dur:.2f}s)  {line["text"]}')

    sf.write(os.path.join(ROOT, 'public', 'dayone', 'audio', 'voz_completa.wav'), track.astype(np.float32), SR, subtype='PCM_16')
    with open(TS_OUT, 'w', encoding='utf8') as fh:
        fh.write('// Generado por tools/generate_voice_dayone.py — no editar a mano.\n')
        fh.write(f'// Voz IA: Kokoro v1.0 · {VOICE} · {LANG}\n')
        fh.write('export type VoiceChunk = {text: string; keys: string[]; startMs: number; endMs: number};\n')
        fh.write('export type VoiceLine = {file: string; text: string; startMs: number; endMs: number; hideOnScreen: boolean; chunks: VoiceChunk[]};\n')
        fh.write('export const voiceLines: VoiceLine[] = ' + json.dumps(timeline, ensure_ascii=False, indent=2) + ';\n')
    print('OK')


if __name__ == '__main__':
    main()
