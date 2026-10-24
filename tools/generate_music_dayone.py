"""
Música original y efectos del tráiler RobloxDayOneTrailer (38 s, 120 BPM, 48 kHz).
Síntesis propia con numpy/scipy, sin muestras de terceros. Semilla fija: resultado idéntico
en cada ejecución.

Estructura (sigue el guion y los cortes):
  0–3 s    impacto inmediato (gancho)
  3–4 s    pausa musical (revelado "YO ESTUVE DESDE EL DÍA UNO")
  4–13 s   ritmo enérgico
  13–25 s  aventura y entusiasmo
  25–32 s  crecimiento emocional; silencio breve tras "día uno" (~30,8 s)
  32–38 s  clímax y golpe final

Uso:  python3 tools/generate_music_dayone.py
Salida: public/dayone/audio/music.wav y public/dayone/audio/sfx/*.wav
"""
import os
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48000
BEAT = 0.5
DUR = 38.0
N = int(SR * DUR)
rng = np.random.default_rng(1138)

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
OUT = os.path.join(ROOT, 'public', 'dayone', 'audio')
os.makedirs(os.path.join(OUT, 'sfx'), exist_ok=True)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def lp(x, f, o=2):
    return sosfilt(butter(o, min(f, SR / 2 - 100), 'low', fs=SR, output='sos'), x)


def hp(x, f, o=2):
    return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)


def bp(x, lo, hi, o=2):
    return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)


def adsr(n, a, d, s, r):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    e = np.full(n, s, float)
    a = min(a, n)
    e[:a] = np.linspace(0, 1, a, endpoint=False)
    d = min(d, n - a)
    e[a:a + d] = np.linspace(1, s, d, endpoint=False)
    r = min(r, n)
    e[n - r:] *= np.linspace(1, 0, r)
    return e


def saw(f, n, det=0.0, harm=22):
    t = np.arange(n) / SR
    f = f * (1 + det)
    out = np.zeros(n)
    ph = rng.uniform(0, 2 * np.pi)
    for k in range(1, harm + 1):
        if f * k > 12000:
            break
        out += np.sin(2 * np.pi * f * k * t + ph * k) / k
    return out * 0.55


class Bus:
    def __init__(self):
        self.L = np.zeros(N + SR * 4)
        self.R = np.zeros(N + SR * 4)

    def add(self, sig, t0, g=1.0, pan=0.0):
        i = int(t0 * SR)
        n = min(len(sig), len(self.L) - i)
        if n <= 0:
            return
        self.L[i:i + n] += sig[:n] * g * np.cos((pan + 1) * np.pi / 4)
        self.R[i:i + n] += sig[:n] * g * np.sin((pan + 1) * np.pi / 4)

    def add_st(self, l, r, t0, g=1.0):
        i = int(t0 * SR)
        n = min(len(l), len(self.L) - i)
        self.L[i:i + n] += l[:n] * g
        self.R[i:i + n] += r[:n] * g


def reverb(L, R, sec=2.6, wet=0.3, tone=5000):
    n = int(sec * SR)
    t = np.arange(n) / SR
    dec = np.exp(-t * 6.9 / sec)
    irl = lp(rng.standard_normal(n), tone) * dec
    irr = lp(rng.standard_normal(n), tone) * dec
    irl /= np.sqrt((irl ** 2).sum())
    irr /= np.sqrt((irr ** 2).sum())
    return (L * (1 - wet) + fftconvolve(L, irl)[:len(L)] * wet * 1.6,
            R * (1 - wet) + fftconvolve(R, irr)[:len(R)] * wet * 1.6)


def pad(m, dur, cut=1800, att=0.5, rel=1.0):
    n = int((dur + rel) * SR)
    l = saw(hz(m), n, -0.004) + saw(hz(m), n, 0.0035) * 0.8
    r = saw(hz(m), n, 0.004) + saw(hz(m), n, -0.003) * 0.8
    e = adsr(n, att, 0.4, 0.8, rel)
    return lp(l, cut) * e, lp(r, cut) * e


def pluck(m, dur=0.42, bright=3200):
    n = int(dur * SR)
    t = np.arange(n) / SR
    tri = 2 * np.abs(2 * ((hz(m) * t) % 1) - 1) - 1
    s = saw(hz(m), n, 0, 14) * 0.55 + tri * 0.5
    return lp(s * np.exp(-t * 7.5) * np.minimum(1, t * 400), bright)


def piano(m, dur=1.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * hz(m) * k * t) * (0.6 ** (k - 1)) * np.exp(-t * (1.8 + k * 0.9)) for k in range(1, 7))
    return s * np.minimum(1, t * 500)


def bell(m, dur=2.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * hz(m) * t) + 0.45 * np.sin(2 * np.pi * hz(m) * 2.76 * t) * np.exp(-t * 3)
         + 0.25 * np.sin(2 * np.pi * hz(m) * 5.4 * t) * np.exp(-t * 6))
    return s * np.exp(-t * 2.2) * np.minimum(1, t * 600)


def bass(m, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * hz(m) * t) + 0.35 * lp(saw(hz(m), n, 0, 10), 600)) * adsr(n, 0.005, 0.15, 0.75, 0.06)


def kick(dur=0.45):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 44 + 90 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) + lp(rng.standard_normal(n), 5000) * np.exp(-t * 250) * 0.3


def taiko(dur=0.9, f0=170, f1=70):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 18)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5) + bp(rng.standard_normal(n), 120, 900) * np.exp(-t * 22) * 0.7


def snare(dur=0.3):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.5 + bp(rng.standard_normal(n), 1500, 9000) * np.exp(-t * 16)


def clap(dur=0.35):
    n = int(dur * SR)
    t = np.arange(n) / SR
    env = np.exp(-t * 18) + 0.6 * np.exp(-np.maximum(0, t - 0.012) * 40) * (t > 0.012)
    return bp(rng.standard_normal(n), 900, 5000) * env


def hat(dur=0.06):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7500) * np.exp(-t * 70)


def boom(dur=3.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 28 + 55 * np.exp(-t * 4)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.5) + lp(rng.standard_normal(n), 2500) * np.exp(-t * 3.5) * 0.45
            + bp(rng.standard_normal(n), 60, 400) * np.exp(-t * 12) * 0.8)


def riser(dur=2.0, f0=300, f1=6000):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    steps = 24
    seg = n // steps
    for k in range(steps):
        a, b = k * seg, (k + 1) * seg if k < steps - 1 else n
        fc = f0 * (f1 / f0) ** (k / steps)
        out[a:b] = bp(noise, fc * 0.7, min(fc * 1.4, SR / 2 - 200))[a:b]
    return (out + np.sin(2 * np.pi * np.cumsum(220 * 4 ** (t / dur)) / SR) * 0.15) * (t / dur) ** 2.2


def reverse_swell(dur=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return lp(rng.standard_normal(n), 3000) * (t / dur) ** 3


# Sol mayor: Em – C – G – D (vi – IV – I – V)
CHORDS = [[52, 55, 59, 64], [48, 52, 55, 60], [55, 59, 62, 67], [50, 54, 57, 62]]
ROOTS = [40, 36, 43, 38]
ARP = [[64, 67, 71, 76], [60, 64, 67, 72], [62, 67, 71, 74], [62, 66, 69, 74]]


def chord(t):
    return int(t // 2) % 4


music, drums, arp, lead = Bus(), Bus(), Bus(), Bus()

# ---- 0–3 s: gancho
drums.add(boom(3.0), 0.0, 0.9)
drums.add(taiko(1.2, 150, 55), 0.0, 0.8)
for m in CHORDS[0]:
    l, r = pad(m, 2.6, 1500, att=0.02)
    music.add_st(l, r, 0.0, 0.07)
for i, (t0, m) in enumerate([(0.5, 76), (1.0, 79), (1.5, 83), (2.0, 81)]):
    music.add(bell(m), t0, 0.08, pan=0.25 * (-1) ** i)
drums.add(reverse_swell(1.0), 2.0, 0.18)
drums.add(taiko(1.0, 160, 60), 3.0, 0.55)  # golpe del revelado

# ---- 3–4 s: pausa (solo un pad suave y una nota de piano)
for m in [52, 59, 64]:
    l, r = pad(m, 1.0, 1100, att=0.3, rel=0.8)
    music.add_st(l, r, 3.0, 0.05)
music.add(piano(76, 2.0), 3.05, 0.16)

# ---- pads 4–38 s
def pad_gain(t):
    if t < 13:
        return 0.12
    if t < 25:
        return 0.13
    if t < 32:
        return 0.15 + (t - 25) / 7 * 0.05
    return 0.19


for bar in range(2, 18):
    t0 = bar * 2.0
    if t0 >= 36:
        break
    cut = 1500 if t0 < 13 else 2300 if t0 < 25 else (1500 + (t0 - 25) * 180) if t0 < 32 else 3200
    for m in CHORDS[bar % 4]:
        l, r = pad(m, 2.0, cut)
        music.add_st(l, r, t0, pad_gain(t0) / 2)

# ---- bajo en corcheas (4–30.8 y 32–36)
i = int(4 / (BEAT / 2))
while i * BEAT / 2 < 36:
    t = i * BEAT / 2
    if 30.75 <= t < 32:
        i += 1
        continue
    if 25 <= t < 30.75 and i % 2 == 1:
        i += 1
        continue
    g = 0.22 if t < 13 else 0.25 if t < 25 else 0.24 if t < 32 else 0.3
    music.add(lp(bass(ROOTS[chord(t)], BEAT / 2 * 0.92), 900), t, g * (1.0 if i % 2 == 0 else 0.65))
    i += 1

# ---- arpegio en semicorcheas (4–25 y 32–36), con eco estéreo
step = BEAT / 4
i = int(4 / step)
while i * step < 36:
    t = i * step
    if 25 <= t < 32:
        i += 1
        continue
    notes = ARP[chord(t)]
    m = notes[[0, 1, 2, 3, 2, 1, 2, 3][i % 8]] + (12 if t >= 13 and i % 8 in (3, 7) else 0)
    arp.add(pluck(m, 0.4, 2700 if t < 13 else 4200), t, (0.1 if t < 13 else 0.12 if t < 25 else 0.14) * (0.9 if i % 4 == 0 else 0.6),
            pan=-0.35 if i % 2 else 0.35)
    i += 1
d = int(0.375 * SR)
for k, fb in enumerate([0.33, 0.16]):
    sh = d * (k + 1)
    arp.L[sh:] += arp.R[:-sh] * fb
    arp.R[sh:] += arp.L[:-sh] * fb

# ---- 25–32 s: momento emocional (piano en corcheas + campanas)
for i in range(int(25 / BEAT) * 2, int(30.75 / BEAT) * 2):
    t = i * BEAT / 2
    notes = ARP[chord(t)]
    music.add(piano(notes[[0, 2, 1, 3][i % 4]] - 12, 1.2), t, 0.1 + (t - 25) / 6 * 0.04, pan=0.15 * (-1) ** i)
for t0, m in [(25.0, 76), (27.0, 79), (29.0, 83), (30.0, 81)]:
    music.add(bell(m, 2.2), t0, 0.09)
drums.add(riser(1.4, 400, 6000), 30.6, 0.12)

# ---- 32–36 s: melodía principal del clímax
melody = [(32.0, 79, 0.75), (32.75, 81, 0.25), (33.0, 83, 0.5), (33.5, 81, 0.5), (34.0, 79, 1.0),
          (35.0, 78, 0.5), (35.5, 76, 0.5), (36.0, 79, 1.6)]
for t0, m, dd in melody:
    n = int((dd + 0.25) * SR)
    t = np.arange(n) / SR
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * t) * np.minimum(1, t * 3)
    s = sum(np.sin(2 * np.pi * hz(m) * k * np.cumsum(vib) / SR) / k for k in range(1, 13))
    e = adsr(n, 0.03, 0.2, 0.75, 0.22)
    lead.add(lp(s * e, 2800) * 0.5, t0, 0.15)
    lead.add(lp(s * e, 1800) * 0.5, t0 + 0.012, 0.07, pan=0.4)

# ---- batería
def drum_section(t0, t1, kick_g, snare_g, hat_g, taiko_g, four=False):
    i = int(round(t0 / BEAT))
    while i * BEAT < t1 - 1e-6:
        t = i * BEAT
        b = i % 4
        if four or b in (0, 2):
            drums.add(kick(), t, kick_g)
        if snare_g and b in (1, 3):
            drums.add(snare(), t, snare_g)
            drums.add(clap(), t, snare_g * 0.6)
        if hat_g:
            drums.add(hat(), t + BEAT / 2, hat_g, pan=0.3)
            drums.add(hat(), t, hat_g * 0.5, pan=-0.3)
        if taiko_g and b in (0, 3):
            drums.add(taiko(), t, taiko_g, pan=-0.15)
        i += 1


drum_section(4.0, 13.0, 0.45, 0.0, 0.055, 0.0, four=True)
drum_section(13.0, 25.0, 0.5, 0.24, 0.07, 0.28)
drum_section(25.0, 30.5, 0.32, 0.0, 0.0, 0.0)
drum_section(32.0, 36.0, 0.6, 0.3, 0.09, 0.42, four=True)
for k in range(4):  # redoble antes del cierre emocional
    drums.add(taiko(0.6, 200, 95), 24.0 + k * 0.25, 0.18 + k * 0.05)
for t0, g in [(13.0, 0.45), (19.0, 0.4), (25.0, 0.5), (32.0, 0.85)]:
    drums.add(boom(2.6), t0, g)

# ---- golpe final contundente en 36 s y cola
drums.add(boom(3.0), 36.0, 0.95)
drums.add(taiko(1.4, 140, 50), 36.0, 0.8)
for m in [43, 55, 59, 62, 67, 71, 74]:
    l, r = pad(m, 1.2, 3000, att=0.01, rel=0.9)
    music.add_st(l, r, 36.0, 0.075)

# ---- mezcla
mL, mR = reverb(music.L + arp.L + lead.L, music.R + arp.R + lead.R, 2.6, 0.3)
dL, dR = reverb(drums.L, drums.R, 1.5, 0.13, 3500)
# respiro después de "día uno": la armonía baja entre 30,8 y 31,8 s (el riser sigue subiendo)
tt = np.arange(len(mL)) / SR
dip = np.interp(tt, [30.7, 30.95, 31.6, 31.95], [1.0, 0.3, 0.3, 1.0])
mL, mR = mL * dip, mR * dip
L, R = hp(mL + dL, 28)[:N], hp(mR + dR, 28)[:N]
fade = np.ones(N)
fn = int(1.1 * SR)
fade[-fn:] = np.linspace(1, 0, fn) ** 1.4
L, R = L * fade, R * fade
pk = max(np.abs(L).max(), np.abs(R).max())
L, R = np.tanh(L / pk * 1.4) * 0.89, np.tanh(R / pk * 1.4) * 0.89


def write(path, l, r=None):
    r = l if r is None else r
    st = np.clip(np.stack([l, r], 1), -1, 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st * 32767).astype('<i2').tobytes())


write(os.path.join(OUT, 'music.wav'), L, R)


# ---- efectos
def norm(x, p=0.85):
    return x / (np.abs(x).max() + 1e-9) * p


def tail(x, sec=0.8, wet=0.22):
    x = np.concatenate([x, np.zeros(int(sec * SR))])
    l, r = reverb(x, x.copy(), 1.3, wet)
    return norm(l), norm(r)


def whoosh(dur=0.55, f0=500, f1=3500):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    seg = n // 16
    for k in range(16):
        a, b = k * seg, (k + 1) * seg if k < 15 else n
        fc = f0 * (f1 / f0) ** np.sin(np.pi * k / 16)
        out[a:b] = bp(noise, fc * 0.6, min(fc * 1.6, SR / 2 - 200))[a:b]
    return out * np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.6


def pop(dur=0.35):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 500 + 900 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 16)


def sparkle(dur=1.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for k, m in enumerate([88, 91, 95, 100, 103]):
        i = int(k * 0.05 * SR)
        out[i:] += np.sin(2 * np.pi * hz(m) * t[:n - i]) * np.exp(-t[:n - i] * 3.5) * 0.35
    return (out + hp(rng.standard_normal(n), 6000) * np.exp(-t * 3) * 0.2) * np.minimum(1, t * 200)


def soft_hit(dur=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * (60 + 60 * np.exp(-t * 20)) * t) * np.exp(-t * 6) + bp(rng.standard_normal(n), 2000, 8000) * np.exp(-t * 25) * 0.25


for name, x in {'impact': boom(2.4), 'whoosh': whoosh(), 'whip': whoosh(0.3, 900, 6000), 'hit': soft_hit(),
                'pop': pop(), 'sparkle': sparkle(), 'riser': riser(1.4, 400, 7000)}.items():
    l, r = tail(norm(x))
    write(os.path.join(OUT, 'sfx', f'{name}.wav'), l, r)
print('OK', OUT)
