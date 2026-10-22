import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig} from 'remotion';
import {CinematicCaption} from './components/CinematicCaption';
import {EndCard} from './components/EndCard';
import {FilmGrain, Vignette} from './components/FilmGrain';
import {GameplayShot} from './components/GameplayShot';
import {ImpactTitle} from './components/ImpactTitle';
import {KineticTitle} from './components/KineticTitle';
import {LightSweep} from './components/LightSweep';
import {ParticleOverlay} from './components/ParticleOverlay';
import {Subtitles} from './components/Subtitle';
import {MaskWipeEdge} from './components/Transition';
import {WordReveal} from './components/WordReveal';
import {MUSIC, NARRATION, SFX} from './data/audio';
import {shots} from './data/shots';
import {subtitles} from './data/subtitles';
import {palette, WINDOW} from './styles/palette';
import './styles/fonts';

// GameTrailerTikTok — 1080 × 1920, 30 fps, 1350 fotogramas (45 s).
export const Trailer: React.FC = () => {
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: palette.ink}}>
      {/* ---------------- PLANOS DE GAMEPLAY ---------------- */}
      {shots.map((shot) => (
        <Sequence
          key={shot.id}
          name={`Plano ${shot.id}`}
          from={shot.from - shot.overlap}
          durationInFrames={shot.durationInFrames + shot.overlap}
          premountFor={fps}
        >
          <GameplayShot shot={shot} />
        </Sequence>
      ))}

      {/* Degradados para legibilidad de títulos (arriba) y subtítulos (abajo) */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: `linear-gradient(180deg, rgba(11,16,32,0.62) 0px, rgba(11,16,32,0.25) ${WINDOW.top}px, rgba(11,16,32,0) ${WINDOW.top + 120}px, rgba(11,16,32,0) ${WINDOW.top + WINDOW.height - 120}px, rgba(11,16,32,0.3) ${WINDOW.top + WINDOW.height}px, rgba(11,16,32,0.72) 1920px)`,
        }}
      />

      {/* ---------------- CAPAS DE TRANSICIÓN ---------------- */}
      <Sequence name="Destello gancho" from={8} durationInFrames={22}>
        <LightSweep duration={22} strength={0.28} />
      </Sequence>
      <Sequence name="Barrido de luz 1→2" from={82} durationInFrames={18}>
        <LightSweep duration={18} />
      </Sequence>
      <Sequence name="Máscara 2→3" from={230} durationInFrames={10}>
        <MaskWipeEdge duration={10} />
      </Sequence>
      <Sequence name="Máscara 4a→4b" from={457} durationInFrames={8}>
        <MaskWipeEdge duration={8} />
      </Sequence>
      <Sequence name="Máscara 6c→6d" from={789} durationInFrames={6}>
        <MaskWipeEdge duration={6} />
      </Sequence>
      <Sequence name="Barrido de luz 8c→8d" from={1119} durationInFrames={16}>
        <LightSweep duration={16} strength={0.5} />
      </Sequence>

      {/* ---------------- ATMÓSFERA ---------------- */}
      <Sequence name="Partículas mundo" from={90} durationInFrames={150}>
        <ParticleOverlay duration={150} seed="mundo" />
      </Sequence>
      <Sequence name="Viñeta misterio" from={870} durationInFrames={150}>
        <MysteryVignette />
      </Sequence>
      <Sequence name="Brasas misterio" from={870} durationInFrames={150}>
        <ParticleOverlay duration={150} seed="brasas" color="255,170,90" count={26} opacity={0.7} />
      </Sequence>
      <Sequence name="Partículas cierre" from={1200} durationInFrames={150}>
        <ParticleOverlay duration={150} seed="cierre" count={30} />
      </Sequence>

      {/* ---------------- TEXTOS ---------------- */}
      {/* 1 — Gancho */}
      <Sequence name="T1 ¿Y si te esperara otro mundo?" from={5} durationInFrames={85}>
        <KineticTitle
          lines={[{text: '¿Y SI TE'}, {text: 'ESPERARA'}, {text: 'OTRO MUNDO?', color: palette.cyan}]}
          size={104}
          stagger={5}
          entry={13}
          exitAt={74}
          sweepAt={34}
          centerY={318}
        />
      </Sequence>

      {/* 2 — Un mundo por descubrir */}
      <Sequence name="C2 Aldea Musgosa" from={100} durationInFrames={132}>
        <CinematicCaption text="ALDEA MUSGOSA" duration={132} />
      </Sequence>
      <Sequence name="T2 Un mundo por descubrir" from={104} durationInFrames={136}>
        <KineticTitle
          lines={[{text: 'UN MUNDO'}, {text: 'POR DESCUBRIR', color: palette.cyan}]}
          size={86}
          stagger={6}
          entry={16}
          exitAt={122}
          drift={-36}
          driftDuration={136}
          sweepAt={26}
        />
      </Sequence>

      {/* 3 — Explora más allá */}
      <Sequence name="C3 Llanura Ámbar" from={246} durationInFrames={54}>
        <CinematicCaption text="LLANURA ÁMBAR" duration={54} />
      </Sequence>
      <Sequence name="T3 Explora más allá" from={252} durationInFrames={138}>
        <KineticTitle
          lines={[{text: 'EXPLORA'}, {text: 'MÁS ALLÁ', color: palette.cyan}]}
          size={96}
          stagger={5}
          entry={14}
          exitAt={126}
          drift={24}
          driftDuration={138}
        />
      </Sequence>

      {/* 4 — Personajes. Secretos. Aventuras. */}
      <Sequence name="C4a Tendera Mara" from={398} durationInFrames={64}>
        <CinematicCaption text="TENDERA MARA" duration={64} />
      </Sequence>
      <Sequence name="C4b Guardián Tomo" from={470} durationInFrames={66}>
        <CinematicCaption text="GUARDIÁN TOMO · MOSSBROOK" duration={66} />
      </Sequence>
      <Sequence name="T4 Personajes. Secretos. Aventuras." from={402} durationInFrames={138}>
        <WordReveal
          words={[{text: 'PERSONAJES.'}, {text: 'SECRETOS.', color: palette.cyan}, {text: 'AVENTURAS.', color: palette.gold}]}
          delay={12}
          size={78}
          exitAt={128}
        />
      </Sequence>

      {/* 5 — Siempre hay algo por descubrir */}
      <Sequence name="C5a Paso de Ceniza" from={548} durationInFrames={64}>
        <CinematicCaption text="PASO DE CENIZA" duration={64} />
      </Sequence>
      <Sequence name="C5b Forja Brasa" from={622} durationInFrames={62}>
        <CinematicCaption text="FORJA BRASA" duration={62} />
      </Sequence>
      <Sequence name="T5 Siempre hay algo por descubrir" from={546} durationInFrames={130}>
        <ImpactTitle
          lines={[{text: 'SIEMPRE HAY ALGO'}, {text: 'POR DESCUBRIR', color: palette.gold}]}
          size={74}
          glow={palette.gold}
          exitAt={120}
          sweepAt={30}
        />
      </Sequence>

      {/* 6 — Esto es solo el comienzo */}
      <Sequence name="T6 Esto es solo el comienzo" from={700} durationInFrames={170}>
        <ImpactTitle
          lines={[{text: 'ESTO ES SOLO'}, {text: 'EL COMIENZO', color: palette.cyan, size: 96}]}
          size={80}
          stagger={6}
          exitAt={160}
          sweepAt={40}
        />
      </Sequence>

      {/* 7 — ¿Qué te esperará más adelante? */}
      <Sequence name="T7 ¿Qué te esperará más adelante?" from={884} durationInFrames={136}>
        <KineticTitle
          lines={[{text: '¿QUÉ TE ESPERARÁ'}, {text: 'MÁS ADELANTE?', color: palette.gold}]}
          size={72}
          stagger={8}
          entry={18}
          exitAt={126}
          sweepAt={46}
        />
      </Sequence>

      {/* 8 — La aventura apenas comienza */}
      <Sequence name="C8 Espada Templada" from={1084} durationInFrames={40}>
        <CinematicCaption text="ESPADA TEMPLADA" duration={40} />
      </Sequence>
      <Sequence name="T8 La aventura apenas comienza" from={1026} durationInFrames={174}>
        <ImpactTitle
          lines={[{text: 'LA AVENTURA', size: 92}, {text: 'APENAS COMIENZA', color: palette.gold}]}
          size={76}
          glow={palette.gold}
          stagger={5}
          exitAt={166}
          sweepAt={56}
        />
      </Sequence>

      {/* 9 — Cierre y llamada a la acción */}
      <Sequence name="T9 Cierre" from={1200} durationInFrames={150}>
        <EndCard />
      </Sequence>

      {/* Subtítulos de la narración */}
      <Subtitles segments={subtitles} />

      <FilmGrain opacity={0.06} />

      {/* ---------------- AUDIO ---------------- */}
      <Audio name="Música" src={staticFile(MUSIC.src)} volume={musicVolume} />
      {SFX.map((s, i) => (
        <Sequence key={`sfx-${i}`} name={`SFX ${s.name}`} from={s.frame} durationInFrames={fps * 3}>
          <Audio src={staticFile(`audio/sfx/${s.name}.wav`)} volume={s.volume} />
        </Sequence>
      ))}
      {NARRATION.enabled
        ? subtitles.map((seg, i) => (
            <Sequence key={`voz-${i}`} name={`Voz ${i + 1}`} from={Math.round((seg.startMs / 1000) * fps)}>
              <Audio
                src={staticFile(`${NARRATION.folder}/${String(i + 1).padStart(2, '0')}.${NARRATION.ext}`)}
                volume={NARRATION.volume}
              />
            </Sequence>
          ))
        : null}
    </AbsoluteFill>
  );
};

// Música con ducking automático bajo la voz (si la narración está activada).
const musicVolume = (frame: number) => {
  if (!NARRATION.enabled) {
    return MUSIC.volume;
  }
  const t = (frame / 30) * 1000;
  let duck = 0;
  for (const s of subtitles) {
    // rampa de 150 ms antes y 250 ms después de cada frase
    const d = interpolate(t, [s.startMs - 150, s.startMs, s.endMs, s.endMs + 250], [0, 1, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    duck = Math.max(duck, d);
  }
  return MUSIC.volume + (MUSIC.duckedVolume - MUSIC.volume) * duck;
};

const MysteryVignette: React.FC = () => <Vignette strength={0.55} />;
