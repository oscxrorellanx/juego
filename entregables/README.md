# Tráiler TikTok — THE LEGEND OF YOUR SELF

Tráiler vertical de 45 s hecho con Remotion a partir de la grabación real del juego.

## Entregables (esta carpeta)

| Archivo | Qué es |
|---|---|
| `GameTrailerTikTok_Final.mp4` | Tráiler final. 1080 × 1920, 30 fps, 1350 fotogramas (45,000 s), H.264 High yuv420p, Rec.709 (SDR), AAC 48 kHz estéreo 320 kb/s. Sonoridad medida: −14,0 LUFS integrados, pico real −1,0 dBFS. |
| `GameTrailerTikTok_Preview.mp4` | Versión comprimida (540 × 960, ~5 MB) para revisar el montaje. |
| `GameTrailerTikTok.srt` | Subtítulos sincronizados (15 segmentos). |
| `Narracion.txt` | Guion de la voz, con el tiempo de cada frase para grabarla. |
| `ShotList.md` | Lista de planos: tiempos originales y finales, contenido y justificación. |
| `GameTrailerTikTok_ContactSheet.jpg` | Una captura de cada una de las 9 escenas. |

**Importante:** el tráiler **no tiene voz** todavía (no había servicio de síntesis de voz disponible). Lleva música original, efectos y subtítulos. Ver "Añadir la voz".

## Estructura del proyecto

```
src/
  Root.tsx                 registra la composición GameTrailerTikTok (1080×1920, 30 fps, 1350 f)
  Trailer.tsx              línea de tiempo completa: planos, títulos, transiciones, audio
  components/
    GameplayShot.tsx       un plano: fondo desenfocado + banda nítida, cámara simulada y transición de entrada
    KineticTitle.tsx       A · título con máscara, translateY, escala 0,92→1 y desenfoque breve (+ barrido de luz)
    WordReveal.tsx         B · palabras en secuencia
    ImpactTitle.tsx        C · título de impacto con sobreimpresión luminosa
    Subtitle.tsx           D · subtítulos con palabras clave resaltadas
    CinematicCaption.tsx   E · etiquetas editoriales (rombo + línea fina)
    LightSweep.tsx         transición B · barrido de luz
    Transition.tsx         transición C · filo de la máscara diagonal (+ índice de transiciones)
    ParticleOverlay.tsx    partículas deterministas
    FilmGrain.tsx          grano de película y viñeta
    EndCard.tsx            cierre: nombre del juego + llamada a la acción
    anim.ts                curvas e interpolación
  data/
    shots.ts               planos: tiempos, origen, cámara, transición, etiqueta
    subtitles.ts           subtítulos (también generan el .srt)
    audio.ts               música, efectos (fotograma a fotograma) y narración
  styles/
    palette.ts             colores, tipografías y medidas de la composición
    fonts.ts               carga de Archivo Black e Inter (archivos locales)
public/
  shots/                   20 clips cortados del gameplay (+ versión desenfocada *_bg.mp4)
  audio/music.wav          música original sintetizada (45 s)
  audio/sfx/*.wav          whoosh, whip, impact, hit, tick, riser, shimmer
  fonts/                   Archivo Black e Inter (licencia SIL OFL incluida)
  gameplay/                aquí va la grabación original (no está en git: pesa 136 MB)
tools/
  cut_shots.py             vuelve a cortar los clips desde public/gameplay/gameplay.mp4
  generate_audio.py        regenera música y efectos (determinista: siempre el mismo resultado)
  export_srt.ts            genera el .srt desde src/data/subtitles.ts
  master_audio.sh          normaliza el audio del render (−14 LUFS / −1 dBTP), sin tocar la imagen
```

Todas las animaciones dependen solo del número de fotograma (`useCurrentFrame`, `interpolate`, `random()` con semilla de Remotion). No hay animaciones CSS, temporizadores ni valores aleatorios no deterministas.

## Renderizar

```bash
npm install
npx remotion studio                       # previsualizar y editar
npx remotion render src/index.ts GameTrailerTikTok out/render_raw.mp4 \
  --codec=h264 --crf=16 --pixel-format=yuv420p --color-space=bt709 \
  --audio-codec=aac --audio-bitrate=320k
bash tools/master_audio.sh out/render_raw.mp4 entregables/GameTrailerTikTok_Final.mp4
node tools/export_srt.ts entregables/GameTrailerTikTok.srt
```

Notas:
- En el entorno donde se hizo, Remotion no podía descargar su navegador, así que se usó el Chromium instalado con `--browser-executable=/ruta/a/chromium`. En tu ordenador no hace falta.
- Ese Chromium no decodificaba H.264 en el navegador y Remotion pasó automáticamente a `<OffthreadVideo>` (extrae los fotogramas con su propio ffmpeg). El resultado es el mismo.
- `master_audio.sh` necesita `ffmpeg` instalado.

## Reemplazar clips

1. Pon la grabación en `public/gameplay/gameplay.mp4`. Está publicada como asset de la release `gameplay22` del repositorio.
2. Cambia el segundo de origen en `tools/cut_shots.py` y ejecuta `python3 tools/cut_shots.py`. Cada clip se corta con 0,5 s extra a cada lado para las transiciones.
3. Ajusta el mismo plano en `src/data/shots.ts`: `srcStart` (documentación), `camera` (punto de interés en píxeles del original 1184×478 y zoom), `transitionIn` y `label`.
4. Si cambias duraciones, mantén la suma en 1350 fotogramas y revisa los tiempos de títulos en `Trailer.tsx` y de efectos en `src/data/audio.ts`.

## Añadir la voz

1. Graba las 15 frases de `Narracion.txt` (una por archivo) y guárdalas como `public/audio/voz/01.wav` … `15.wav` (o `.mp3`, cambiando `ext`).
2. En `src/data/audio.ts`, pon `NARRATION.enabled = true`.
3. Vuelve a renderizar. Cada frase empieza en su subtítulo y la música baja sola (ducking) mientras suena la voz.

Si prefieres una sola pista de voz de 45 s, añade en `Trailer.tsx` un `<Audio src={staticFile('audio/voz/narracion.wav')} />` y ajusta los tiempos de `subtitles.ts` a esa grabación.

## Reemplazar la música

Sustituye `public/audio/music.wav` por tu pista (45 s; 120 BPM encaja con los cortes). Los momentos fuertes del montaje están en 0, 18, 23, 34 y 40 s, con una pausa entre 29 y 34 s. Ajusta `MUSIC.volume` en `src/data/audio.ts`.

## Licencias de recursos

- Gameplay: grabación del propio juego.
- Música y efectos: síntesis original (`tools/generate_audio.py`), sin muestras de terceros.
- Fuentes: Archivo Black e Inter, SIL Open Font License 1.1, obtenidas del paquete oficial `@fontsource` en npm.
