"""Corta los planos del tráiler RobloxDayOneTrailer desde la grabación original.

Entrada: public/dayone/gameplay_dayone.mp4 (release "tktk" del repositorio).
Salida:  public/dayone/shots/<id>.mp4 (nítido) y <id>_bg.mp4 (fondo desenfocado).
Cada clip lleva hasta 0,5 s extra antes y después (HANDLE) para las transiciones.
La tabla debe coincidir con src/dayone/data/timeline.ts.
"""
import os
import subprocess

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
V = os.path.join(ROOT, 'public', 'dayone', 'gameplay_dayone.mp4')
O = os.path.join(ROOT, 'public', 'dayone', 'shots')
FPS = 30
HANDLE = 0.5
SRC_DURATION = 37.83

# id, inicio en el original (s), fotogramas en el tráiler, velocidad
SHOTS = [
    ('d1', 24.8, 90, 0.6),
    ('d2', 0.0, 120, 1.0),
    ('d3a', 4.2, 60, 1.0), ('d3b', 6.6, 60, 1.0), ('d3c', 16.6, 60, 1.0),
    ('d4a', 9.6, 30, 1.0), ('d4b', 10.7, 30, 1.0), ('d4c', 11.75, 30, 1.0), ('d4d', 20.8, 45, 1.0), ('d4e', 23.0, 45, 1.0),
    ('d5a', 15.85, 30, 0.6), ('d5b', 31.0, 105, 0.629), ('d5c', 15.0, 45, 0.5),
    ('d6a', 28.2, 135, 0.444), ('d6b', 19.0, 75, 0.572),
    ('d7', 33.2, 180, 0.45),
]

os.makedirs(O, exist_ok=True)
for sid, st, frames, rate in SHOTS:
    src = frames * rate / FPS
    pre = min(HANDLE, st)
    a = st - pre
    t = min(pre + src + HANDLE, SRC_DURATION - a)
    common = ['ffmpeg', '-v', 'error', '-y', '-ss', f'{a:.3f}', '-i', V, '-t', f'{t:.3f}']
    subprocess.run(common + ['-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-g', '10', '-bf', '0', '-pix_fmt', 'yuv420p',
                             '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-an', f'{O}/{sid}.mp4'], check=True)
    subprocess.run(common + ['-vf', 'crop=430:766:467:0,scale=216:384,gblur=sigma=10', '-an', '-c:v', 'libx264', '-preset', 'medium',
                             '-crf', '24', '-g', '10', '-bf', '0', '-pix_fmt', 'yuv420p', f'{O}/{sid}_bg.mp4'], check=True)
    print(sid, f'pre={pre:.2f}s src={src:.2f}s')
