"""
Genera la música original y los efectos de sonido del tráiler.

Todo es síntesis propia (numpy + scipy): no usa muestras de terceros.
Salida (48 kHz, estéreo, WAV 16-bit):
  public/audio/music.wav        -> banda sonora de 45 s sincronizada con el montaje
  public/audio/sfx/*.wav        -> whoosh, impactos, golpes de título, riser, brillo

Uso:  python3 tools/generate_audio.py
La semilla es fija, así que el resultado es siempre idéntico.
"""
import os
import wave

import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
BPM = 120
BEAT = 60 / BPM  # 0.5 s
DUR = 45.0
N = int(SR * DUR)
rng = np.random.default_rng(7)

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(ROOT, "..", "public", "audio"))
os.makedirs(os.path.join(OUT, "sfx"), exist_ok=True)


# ---------------------------------------------------------------- utilidades
def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def lp(x, f, order=2):
    return sosfilt(butter(order, min(f, SR / 2 - 100), "low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def env_adsr(n, a, d, s, r):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    e = np.full(n, s, dtype=float)
    a = min(a, n)
    e[:a] = np.linspace(0, 1, a, endpoint=False)
    d = min(d, n - a)
    e[a:a + d] = np.linspace(1, s, d, endpoint=False)
    r = min(r, n)
    e[n - r:] *= np.linspace(1, 0, r)
    return e


def saw(freq, n, detune=0.0, harmonics=24):
    t = np.arange(n) / SR
    f = freq * (1 + detune)
    out = np.zeros(n)
    ph = rng.uniform(0, 2 * np.pi)
    for k in range(1, harmonics + 1):
        if f * k > 12000:
            break
        out += np.sin(2 * np.pi * f * k * t + ph * k) / k
    return out * 0.55


def tri(freq, n):
    t = np.arange(n) / SR
    return 2 * np.abs(2 * ((freq * t) % 1) - 1) - 1


class Bus:
    def __init__(self):
        self.L = np.zeros(N + SR * 4)
        self.R = np.zeros(N + SR * 4)

    def add(self, sig, t0, gain=1.0, pan=0.0):
        i = int(t0 * SR)
        if i < 0:
            sig = sig[-i:]
            i = 0
        n = min(len(sig), len(self.L) - i)
        if n <= 0:
            return
        gl = gain * np.cos((pan + 1) * np.pi / 4)
        gr = gain * np.sin((pan + 1) * np.pi / 4)
        self.L[i:i + n] += sig[:n] * gl
        self.R[i:i + n] += sig[:n] * gr

    def add_st(self, l, r, t0, gain=1.0):
        i = int(t0 * SR)
        n = min(len(l), len(self.L) - i)
        self.L[i:i + n] += l[:n] * gain
        self.R[i:i + n] += r[:n] * gain


def reverb(L, R, seconds=2.4, wet=0.25, tone=5000):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    decay = np.exp(-t * 6.9 / seconds)
    irl = lp(rng.standard_normal(n), tone) * decay
    irr = lp(rng.standard_normal(n), tone) * decay
    pre = int(0.02 * SR)
    irl = np.concatenate([np.zeros(pre), irl])
    irr = np.concatenate([np.zeros(pre), irr])
    irl /= np.sqrt(np.sum(irl ** 2))
    irr /= np.sqrt(np.sum(irr ** 2))
    wl = fftconvolve(L, irl)[: len(L)]
    wr = fftconvolve(R, irr)[: len(R)]
    return L * (1 - wet) + wl * wet * 1.6, R * (1 - wet) + wr * wet * 1.6


# ---------------------------------------------------------------- instrumentos
def pad_note(m, dur, cutoff=1800, att=0.6, rel=0.9):
    n = int((dur + rel) * SR)
    l = saw(hz(m), n, -0.004) + saw(hz(m), n, 0.0035) * 0.8
    r = saw(hz(m), n, 0.004) + saw(hz(m), n, -0.003) * 0.8
    e = env_adsr(n, att, 0.4, 0.8, rel)
    return lp(l, cutoff) * e, lp(r, cutoff) * e


def pluck(m, dur=0.45, bright=3200):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = saw(hz(m), n, 0, 16) * 0.6 + tri(hz(m), n) * 0.5
    e = np.exp(-t * 7.5) * np.minimum(1, t * 400)
    return lp(s * e, bright)


def bell(m, dur=1.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * hz(m) * t) + 0.45 * np.sin(2 * np.pi * hz(m) * 2.76 * t) * np.exp(-t * 3)
         + 0.25 * np.sin(2 * np.pi * hz(m) * 5.4 * t) * np.exp(-t * 6))
    return s * np.exp(-t * 2.2) * np.minimum(1, t * 600)


def bass_note(m, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * hz(m) * t) + 0.35 * lp(saw(hz(m), n, 0, 10), 600)
    e = env_adsr(n, 0.005, 0.15, 0.75, 0.06)
    return s * e


def kick(dur=0.45, f0=130, f1=42):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    click = lp(rng.standard_normal(n), 5000) * np.exp(-t * 250) * 0.3
    return (np.sin(ph) * np.exp(-t * 7) + click)


def taiko(dur=0.9, f0=170, f1=70):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 18)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 5)
    skin = bp(rng.standard_normal(n), 120, 900) * np.exp(-t * 22) * 0.7
    return body + skin


def snare(dur=0.3):
    n = int(dur * SR)
    t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.5
    noise = bp(rng.standard_normal(n), 1500, 9000) * np.exp(-t * 16)
    return tone + noise


def hat(dur=0.06, open_=False):
    n = int((0.25 if open_ else dur) * SR)
    t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7500) * np.exp(-t * (14 if open_ else 70))


def boom(dur=3.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 28 + 55 * np.exp(-t * 4)
    ph = 2 * np.pi * np.cumsum(f) / SR
    sub = np.sin(ph) * np.exp(-t * 1.5)
    crash = lp(rng.standard_normal(n), 2500) * np.exp(-t * 3.5) * 0.45
    hit = bp(rng.standard_normal(n), 60, 400) * np.exp(-t * 12) * 0.8
    return sub + crash + hit


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
        chunk = bp(noise, fc * 0.7, min(fc * 1.4, SR / 2 - 200))[a:b]
        out[a:b] = chunk
    glide = np.sin(2 * np.pi * np.cumsum(220 * (4 ** (t / dur))) / SR) * 0.15
    e = (t / dur) ** 2.2
    return (out + glide) * e


def whoosh(dur=0.6, f0=500, f1=3500, reverse=False):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    steps = 16
    seg = n // steps
    for k in range(steps):
        a, b = k * seg, (k + 1) * seg if k < steps - 1 else n
        x = k / steps
        fc = f0 * (f1 / f0) ** (np.sin(np.pi * x))
        out[a:b] = bp(noise, fc * 0.6, min(fc * 1.6, SR / 2 - 200))[a:b]
    e = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.6
    if reverse:
        e = (t / dur) ** 2.5
    return out * e


def shimmer(dur=1.4):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for k, m in enumerate([86, 90, 93, 98, 102]):
        d = k * 0.06
        i = int(d * SR)
        s = np.sin(2 * np.pi * hz(m) * t[: n - i]) * np.exp(-t[: n - i] * 3.2)
        out[i:] += s * 0.35
    air = hp(rng.standard_normal(n), 6000) * np.exp(-t * 3) * 0.2
    return (out + air) * np.minimum(1, t * 200)


def soft_hit(dur=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    low = np.sin(2 * np.pi * (60 + 60 * np.exp(-t * 20)) * t) * np.exp(-t * 6)
    top = bp(rng.standard_normal(n), 2000, 8000) * np.exp(-t * 25) * 0.25
    return low + top


def tick(dur=0.25):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 1760 * t) * 0.4 + hp(rng.standard_normal(n), 4000) * 0.3) * np.exp(-t * 30)


# ---------------------------------------------------------------- composición
# Re menor eólico. Progresión por compás (2 s): Dm - Bb - F - C
CHORDS = [
    [50, 53, 57, 62],  # Dm
    [46, 50, 53, 58],  # Bb
    [45, 48, 53, 57],  # F (1ª inv. con La en el bajo)
    [48, 52, 55, 60],  # C
]
BASS_ROOT = [38, 34, 41, 36]
ARP = [[62, 65, 69, 74], [58, 62, 65, 70], [60, 65, 69, 72], [60, 64, 67, 72]]


def chord_at(t):
    return int(t // 2) % 4


music = Bus()
drums = Bus()

# Secciones (segundos)
# 0-3 gancho | 3-18 base aventurera | 18-29 subida | 29-34 pausa | 34-40 clímax | 40-45 resolución

# --- Impacto inicial
drums.add(boom(3.4), 0.0, 0.9)
drums.add(taiko(1.2, 140, 55), 0.0, 0.8)

# --- Pads (todo el tema, con dinámica por sección)
def pad_gain(t):
    if t < 3:
        return 0.16
    if t < 18:
        return 0.13
    if t < 29:
        return 0.15
    if t < 34:
        return 0.10
    if t < 40:
        return 0.20
    return 0.16


for bar in range(0, 20):
    t0 = bar * 2.0
    c = CHORDS[bar % 4]
    cutoff = 1400 if t0 < 18 else (2200 if t0 < 29 else (1100 if t0 < 34 else 3000))
    for m in c:
        l, r = pad_note(m, 2.0, cutoff)
        music.add_st(l, r, t0, pad_gain(t0) / 2)

# Cierre: acorde final de Re mayor (picarda) desde 40 s, largo
for m in [38, 50, 54, 57, 62, 66, 69]:
    l, r = pad_note(m, 3.4, 2600, att=0.05, rel=1.6)
    music.add_st(l, r, 40.0, 0.075)

# --- Bajo pulsante (8 corcheas) 3-29 y 34-40
for i in range(int(3 / (BEAT / 2)), int(40 / (BEAT / 2))):
    t = i * BEAT / 2
    if 29 <= t < 34:
        continue
    root = BASS_ROOT[chord_at(t)]
    g = 0.22 if t < 18 else 0.27
    if t >= 34:
        g = 0.32
    accent = 1.0 if (i % 2 == 0) else 0.65
    music.add(lp(bass_note(root, BEAT / 2 * 0.92), 900), t, g * accent)

# Pausa 29-34: notas largas de bajo
for t0, m in [(29.0, 38), (31.0, 34)]:
    music.add(lp(bass_note(m, 1.9), 400), t0, 0.28)

# --- Arpegio (semicorcheas) 3-29 y 34-40, con delay estéreo
arp = Bus()
step = BEAT / 4
for i in range(int(3 / step), int(40 / step)):
    t = i * step
    if 29 <= t < 34:
        continue
    notes = ARP[chord_at(t)]
    pattern = [0, 1, 2, 3, 2, 1, 2, 3]
    m = notes[pattern[i % 8]]
    if t >= 18:
        m += 12 if (i % 8 in (3, 7)) else 0
    vel = 0.9 if i % 4 == 0 else 0.6
    g = 0.11 if t < 18 else (0.13 if t < 29 else 0.15)
    bright = 2600 if t < 18 else 4200
    arp.add(pluck(m, 0.4, bright), t, g * vel, pan=(-0.35 if i % 2 else 0.35))
# delay 3/8 de pulso
d = int(0.375 * SR)
for k, fb in enumerate([0.35, 0.18]):
    sh = d * (k + 1)
    arp.L[sh:] += arp.R[:-sh] * fb
    arp.R[sh:] += arp.L[:-sh] * fb

# --- Campanas de misterio (29-34) y motivo en el gancho
for t0, m in [(29.2, 74), (30.2, 77), (31.2, 76), (32.2, 72), (33.0, 69)]:
    music.add(bell(m, 2.2), t0, 0.11, pan=0.2)
for t0, m in [(0.6, 74), (1.6, 69)]:
    music.add(bell(m, 2.0), t0, 0.09, pan=-0.2)

# --- Melodía principal (clímax 34-40): sierra filtrada tipo metal
melody = [(34.0, 74, 0.75), (34.75, 77, 0.25), (35.0, 76, 0.5), (35.5, 74, 0.5),
          (36.0, 70, 1.0), (37.0, 72, 0.5), (37.5, 74, 0.5),
          (38.0, 72, 0.75), (38.75, 69, 0.25), (39.0, 67, 0.5), (39.5, 69, 0.5)]
lead = Bus()
for t0, m, dd in melody:
    n = int((dd + 0.25) * SR)
    t = np.arange(n) / SR
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * t) * np.minimum(1, t * 3)
    s = np.zeros(n)
    for k in range(1, 14):
        s += np.sin(2 * np.pi * hz(m) * k * np.cumsum(vib) / SR) / k
    e = env_adsr(n, 0.03, 0.2, 0.75, 0.22)
    lead.add(lp(s * e, 2800) * 0.5, t0, 0.17)
    lead.add(lp(s * e, 1800) * 0.5, t0 + 0.01, 0.08, pan=0.4)
# nota final larga de la melodía
n = int(3.0 * SR)
t = np.arange(n) / SR
s = sum(np.sin(2 * np.pi * hz(74) * k * t) / k for k in range(1, 12))
lead.add(lp(s * env_adsr(n, 0.02, 0.4, 0.6, 1.8), 2400) * 0.5, 40.0, 0.11)

# --- Batería
def drum_section(t0, t1, kick_g, snare_on, hat_g, taiko_g):
    i = int(t0 / BEAT)
    while i * BEAT < t1 - 1e-6:
        t = i * BEAT
        beat_in_bar = i % 4
        if beat_in_bar in (0, 2) or (t >= 34 and beat_in_bar == 3):
            drums.add(kick(), t, kick_g)
        if snare_on and beat_in_bar in (1, 3):
            drums.add(snare(), t, 0.28)
        if hat_g:
            drums.add(hat(), t + BEAT / 2, hat_g, pan=0.3)
            drums.add(hat(), t, hat_g * 0.5, pan=-0.3)
        if taiko_g and beat_in_bar in (0, 3):
            drums.add(taiko(), t, taiko_g, pan=-0.15)
        i += 1


drum_section(3.0, 18.0, 0.42, False, 0.05, 0.0)
drum_section(18.0, 23.0, 0.5, False, 0.07, 0.30)
drum_section(23.0, 29.0, 0.55, True, 0.08, 0.38)
drum_section(34.0, 40.0, 0.62, True, 0.09, 0.45)
# redoble de taikos antes del clímax y de la resolución
for k in range(8):
    drums.add(taiko(0.6, 190, 90), 33.0 + k * 0.125, 0.12 + k * 0.035, pan=(k % 2) * 0.4 - 0.2)
for k in range(4):
    drums.add(taiko(0.6, 200, 95), 39.0 + k * 0.25, 0.25 + k * 0.05)

# --- Elementos de transición musicales (sincronizados con cortes clave)
drums.add(riser(2.6), 26.4, 0.16)
drums.add(riser(2.0), 32.0, 0.17)
for t0, g in [(18.0, 0.55), (23.0, 0.6), (34.0, 0.85), (40.0, 0.7)]:
    drums.add(boom(3.0), t0, g)

# ---------------------------------------------------------------- mezcla
mL = music.L + arp.L + lead.L
mR = music.R + arp.R + lead.R
mL, mR = reverb(mL, mR, 2.8, 0.32)
dL, dR = reverb(drums.L, drums.R, 1.6, 0.14, 3500)
L = mL + dL
R = mR + dR
L, R = hp(L, 28), hp(R, 28)
L, R = L[:N], R[:N]

# Fundido final suave (sin corte brusco) en los últimos 1.6 s
fade = np.ones(N)
fn = int(1.6 * SR)
fade[-fn:] = np.linspace(1, 0, fn) ** 1.5
# entrada inmediata (sin silencio inicial)
L *= fade
R *= fade

# limitador suave
peak = max(np.max(np.abs(L)), np.max(np.abs(R)))
L, R = L / peak * 1.4, R / peak * 1.4
L, R = np.tanh(L) * 0.89, np.tanh(R) * 0.89


def write_wav(path, l, r=None):
    if r is None:
        r = l
    st = np.stack([l, r], axis=1)
    st = np.clip(st, -1, 1)
    data = (st * 32767).astype("<i2").tobytes()
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data)


write_wav(os.path.join(OUT, "music.wav"), L, R)


def norm(x, peak=0.8):
    return x / (np.max(np.abs(x)) + 1e-9) * peak


def with_tail(x, seconds=1.0, wet=0.25):
    pad = np.concatenate([x, np.zeros(int(seconds * SR))])
    l, r = reverb(pad, pad.copy(), 1.4, wet)
    return l, r


sfx = {
    "impact": boom(2.6),
    "whoosh": whoosh(0.55),
    "whip": whoosh(0.32, 900, 6000),
    "riser": riser(1.6, 400, 7000),
    "shimmer": shimmer(1.6),
    "hit": soft_hit(1.0),
    "tick": tick(0.3),
}
for name, x in sfx.items():
    l, r = with_tail(norm(x), 0.8, 0.22)
    write_wav(os.path.join(OUT, "sfx", f"{name}.wav"), norm(l, 0.85), norm(r, 0.85))

print("OK:", OUT)
