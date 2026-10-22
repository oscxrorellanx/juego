#!/usr/bin/env bash
# Masteriza el audio del render de Remotion (2 pasadas de loudnorm: -14 LUFS, -1 dBTP)
# sin recodificar el vídeo, y deja el contenedor en exactamente 45 s.
# Uso: bash tools/master_audio.sh out/trailer/render_raw.mp4 out/trailer/GameTrailerTikTok_Final.mp4
set -euo pipefail
IN="$1"; OUT="$2"
J=$(ffmpeg -nostats -i "$IN" -vn -af loudnorm=I=-14:TP=-1.0:LRA=9:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
v() { echo "$J" | grep "\"$1\"" | grep -oE '\-?[0-9.]+' | head -1; }
ffmpeg -v error -y -i "$IN" -t 45 -c:v copy \
  -af "loudnorm=I=-14:TP=-1.0:LRA=9:measured_I=$(v input_i):measured_TP=$(v input_tp):measured_LRA=$(v input_lra):measured_thresh=$(v input_thresh):offset=$(v target_offset):linear=true,aresample=48000" \
  -c:a aac -b:a 320k -ar 48000 -movflags +faststart "$OUT"
