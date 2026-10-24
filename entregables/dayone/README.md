# Anuncio "Día uno" — RobloxDayOneTrailer

Anuncio vertical de 38 s para TikTok con voz generada por IA, música original y subtítulos sincronizados.

## Entregables

| Archivo | Qué es |
|---|---|
| `Roblox_DayOne_TikTok_Final.mp4` | Final: 1080 × 1920, 30 fps, 1140 fotogramas (38,000 s), H.264 High yuv420p, Rec.709, AAC 48 kHz estéreo. Sonoridad medida: −14,1 LUFS, pico real −0,9 dBFS. |
| `Roblox_DayOne_Preview.mp4` | Previsualización comprimida (540 × 960, ~5 MB). |
| `Roblox_DayOne_Subtitulos.srt` | 17 subtítulos con los tiempos medidos de la voz. |
| `Roblox_DayOne_Guion.txt` | Guion narrado con tiempos, textos en pantalla y texto sugerido para la descripción. |
| `Roblox_DayOne_ShotList.md` | Planos: tiempos originales y finales, velocidad, contenido y motivo. |
| `Roblox_DayOne_Voz_IA.wav` | Pista de voz IA completa (38 s, ya colocada). |
| `Roblox_DayOne_Musica.wav` | Música original (38 s). |
| `Roblox_DayOne_ContactSheet.jpg` | Una captura de cada momento clave. |

## Estructura

```
src/dayone/
  RobloxDayOneTrailer.tsx       composición (registrada en src/Root.tsx)
  components/
    GameplayShot.tsx            plano: fondo desenfocado + banda nítida + transición de entrada
    CinematicZoom.tsx           cámara simulada dentro de la zona útil de la grabación
    ImpactTitle.tsx             gancho: escala 0,85→1, desenfoque 8→0, 10 fotogramas
    KineticText.tsx             títulos con spring (escala 0,9→1, +44 px → 0, 12 f; salida 8 f)
    GoldenReveal.tsx            revelado de palabras con resplandor dorado ("DÍA UNO")
    MotionSubtitle.tsx          subtítulos con claves doradas (máx. 2 líneas)
    LightSweep.tsx              barrido de luz sobre texto (12–14 f)
    TransitionMask.tsx          máscara diagonal + filo luminoso
    CommentCTA.tsx              cierre: ENTRA AL JUEGO · DA LIKE Y SÍGUEME · COMENTA: YO ESTUVE AQUÍ
    HeartAnimation.tsx          corazón con latido y anillo
    ParticleOverlay.tsx         partículas deterministas
    EditorialLabel.tsx          etiquetas pequeñas
    AudioTimeline.tsx           música con ducking automático + voz + efectos
    motion.ts                   curvas y spring compartidos
  data/
    palette.ts                  colores, fuentes, medidas, SHOW_CREATOR_TAG
    timeline.ts                 planos (origen, velocidad, cámara, transición) y efectos de sonido
    subtitles.ts                subtítulos a partir de la voz
    voice.generated.ts          tiempos reales de la voz (generado, no editar)
public/dayone/
  gameplay_dayone.mp4           grabación original
  shots/                        16 clips cortados (+ fondos *_bg.mp4)
  audio/voz/01–11.wav           voz IA, una frase por archivo
  audio/music.wav, sfx/*.wav    música y efectos originales
tools/
  cut_dayone.py                 corta los clips
  generate_voice_dayone.py      genera la voz IA y sus tiempos
  generate_music_dayone.py      genera música y efectos (determinista)
  export_srt_dayone.py          genera el .srt
  master_audio.sh               normaliza a −14 LUFS / −1 dBTP sin tocar la imagen
```

## Renderizar

```bash
npm install
npx remotion studio                                   # previsualizar
npx remotion render src/index.ts RobloxDayOneTrailer out/dayone_raw.mp4 \
  --codec=h264 --crf=16 --pixel-format=yuv420p --color-space=bt709 \
  --audio-codec=aac --audio-bitrate=320k
bash tools/master_audio.sh out/dayone_raw.mp4 entregables/dayone/Roblox_DayOne_TikTok_Final.mp4 38
python3 tools/export_srt_dayone.py entregables/dayone/Roblox_DayOne_Subtitulos.srt
```

En el entorno donde se hizo se añadió `--browser-executable=<ruta a Chromium>`, porque Remotion no podía descargar su navegador. En tu ordenador no hace falta.

## Cambiar la voz

- **Regenerar la voz IA** (por ejemplo, otra velocidad u otro texto): edita `LINES` en `tools/generate_voice_dayone.py` y ejecuta:
  ```bash
  pip install kokoro-onnx soundfile scipy numpy
  # descarga kokoro-v1.0.onnx y voices-v1.0.bin de la release "model-files-v1.0" de thewh1teagle/kokoro-onnx en GitHub
  python3 tools/generate_voice_dayone.py /carpeta/con/los/modelos
  ```
  El script reescribe los archivos de voz y `voice.generated.ts`, así que los subtítulos y el ducking se ajustan solos. Si cambia mucho la frase 10, revisa los fotogramas de `CommentCTA` en `RobloxDayOneTrailer.tsx`.
- **Usar tu propia voz o otra herramienta:** sustituye `public/dayone/audio/voz/NN.wav` con las mismas frases y aproximadamente la misma duración.

## Cambiar clips o música

- Clips: edita la tabla de `tools/cut_dayone.py` y el mismo plano en `src/dayone/data/timeline.ts`, y ejecuta `python3 tools/cut_dayone.py`.
- Música: sustituye `public/dayone/audio/music.wav` (38 s, 120 BPM). Los golpes están en 0, 13, 19, 25, 32 y 36 s, con pausas en 3–4 s y 30,8–32 s.

## Licencias

- Voz: Kokoro v1.0 (Apache 2.0), ejecutado en local.
- Música y efectos: síntesis original, sin muestras de terceros.
- Fuentes: Archivo Black e Inter (SIL OFL 1.1), del paquete oficial `@fontsource`.
