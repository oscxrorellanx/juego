"""Genera Roblox_DayOne_Subtitulos.srt desde src/dayone/data/voice.generated.ts
(tiempos medidos de la voz real). Uso: python3 tools/export_srt_dayone.py salida.srt"""
import json
import os
import sys

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
src = open(os.path.join(ROOT, 'src', 'dayone', 'data', 'voice.generated.ts'), encoding='utf8').read()
lines = json.loads(src.split('voiceLines: VoiceLine[] = ', 1)[1].strip().rstrip(';'))


def ts(ms):
    return f'{ms // 3600000:02d}:{ms % 3600000 // 60000:02d}:{ms % 60000 // 1000:02d},{ms % 1000:03d}'


out, n = [], 0
for line in lines:
    for c in line['chunks']:
        n += 1
        out.append(f"{n}\n{ts(c['startMs'])} --> {ts(c['endMs'])}\n{c['text']}\n")
dest = sys.argv[1] if len(sys.argv) > 1 else 'Roblox_DayOne_Subtitulos.srt'
open(dest, 'w', encoding='utf8').write('\n'.join(out))
print(n, 'segmentos ->', dest)
