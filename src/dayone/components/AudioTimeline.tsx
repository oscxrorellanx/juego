import {Audio} from '@remotion/media';
import React from 'react';
import {interpolate, Sequence, staticFile, useVideoConfig} from 'remotion';
import {daySfx} from '../data/timeline';
import {voiceLines} from '../data/voice.generated';

export const MIX = {
  music: 0.9, // música sin voz
  musicUnderVoice: 0.24, // ducking mientras habla el narrador
  voice: 1.0,
};

// Música con ducking automático: baja 150 ms antes de cada frase y vuelve 300 ms después.
const musicVolume = (frame: number) => {
  const t = (frame / 30) * 1000;
  let duck = 0;
  for (const l of voiceLines) {
    duck = Math.max(
      duck,
      interpolate(t, [l.startMs - 150, l.startMs, l.endMs, l.endMs + 300], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
    );
  }
  return MIX.music + (MIX.musicUnderVoice - MIX.music) * duck;
};

// Toda la pista de audio: música, voz IA (una frase por archivo) y efectos.
export const AudioTimeline: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <>
      <Audio name="Música" src={staticFile('dayone/audio/music.wav')} volume={musicVolume} />
      {voiceLines.map((l) => (
        <Sequence key={l.file} name={`Voz ${l.file}`} from={Math.round((l.startMs / 1000) * fps)}>
          <Audio src={staticFile(`dayone/audio/voz/${l.file}`)} volume={MIX.voice} />
        </Sequence>
      ))}
      {daySfx.map((s, i) => (
        <Sequence key={`sfx${i}`} name={`SFX ${s.name}`} from={s.frame} durationInFrames={fps * 3}>
          <Audio src={staticFile(`dayone/audio/sfx/${s.name}.wav`)} volume={s.volume} />
        </Sequence>
      ))}
    </>
  );
};
