import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import '../styles/fonts';
import {AudioTimeline} from './components/AudioTimeline';
import {CommentCTA} from './components/CommentCTA';
import {EditorialLabel} from './components/EditorialLabel';
import {GameplayShot} from './components/GameplayShot';
import {GoldenReveal} from './components/GoldenReveal';
import {ImpactTitle} from './components/ImpactTitle';
import {KineticText} from './components/KineticText';
import {MotionSubtitle} from './components/MotionSubtitle';
import {clamp, easeInOut} from './components/motion';
import {ParticleOverlay} from './components/ParticleOverlay';
import {TransitionMask} from './components/TransitionMask';
import {C, SHOW_CREATOR_TAG, WIN} from './data/palette';
import {daySubtitles} from './data/subtitles';
import {dayShots} from './data/timeline';

// RobloxDayOneTrailer — 1080 × 1920 · 30 fps · 1140 fotogramas (38 s).
export const RobloxDayOneTrailer: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: C.ink}}>
      {/* ---------- GAMEPLAY ---------- */}
      {dayShots.map((s) => (
        <Sequence key={s.id} name={`Plano ${s.id}`} from={s.from - s.overlap} durationInFrames={s.frames + s.overlap} premountFor={fps}>
          <GameplayShot shot={s} />
        </Sequence>
      ))}

      {/* degradados de legibilidad arriba y abajo */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: `linear-gradient(180deg, rgba(11,16,32,0.6) 0px, rgba(11,16,32,0.22) ${WIN.top}px, rgba(11,16,32,0) ${WIN.top + 140}px, rgba(11,16,32,0) ${WIN.top + WIN.height - 140}px, rgba(11,16,32,0.3) ${WIN.top + WIN.height}px, rgba(11,16,32,0.7) 1920px)`,
        }}
      />

      {/* ---------- TRANSICIONES ---------- */}
      <Sequence name="Máscara → d3a" from={200} durationInFrames={10}>
        <TransitionMask duration={10} />
      </Sequence>
      <Sequence name="Máscara → d3c" from={322} durationInFrames={8}>
        <TransitionMask duration={8} />
      </Sequence>
      <Sequence name="Máscara → d4d" from={474} durationInFrames={6}>
        <TransitionMask duration={6} color={C.gold} />
      </Sequence>
      <Sequence name="Barrido de luz → d5a" from={562} durationInFrames={14}>
        <BandSweep duration={14} />
      </Sequence>
      <Sequence name="Destello gancho" from={4} durationInFrames={14}>
        <BandSweep duration={14} strength={0.28} />
      </Sequence>

      {/* ---------- ATMÓSFERA ---------- */}
      <Sequence name="Partículas promesa" from={90} durationInFrames={120}>
        <ParticleOverlay duration={120} seed="promesa" count={16} opacity={0.45} />
      </Sequence>
      <Sequence name="Partículas emoción" from={750} durationInFrames={210}>
        <ParticleOverlay duration={210} seed="emocion" count={24} opacity={0.6} />
      </Sequence>

      {/* ---------- TEXTOS ---------- */}
      {/* 1 — Gancho */}
      <Sequence name="T1 ¿Y si este juego se hace famoso?" from={1} durationInFrames={89}>
        <ImpactTitle
          lines={[
            {segs: [{t: '¿Y SI'}]},
            {segs: [{t: 'ESTE JUEGO'}]},
            {segs: [{t: 'SE HACE'}]},
            {segs: [{t: 'FAMOSO?', c: C.cyan}], size: 112},
          ]}
          size={100}
          entry={10}
          stagger={3}
          centerY={560}
          scrim
          sweepAt={22}
          exitAt={80}
        />
      </Sequence>

      {/* 2 — La promesa */}
      <Sequence name="T2 Yo estuve desde el día uno" from={92} durationInFrames={118}>
        <GoldenReveal
          lead={{text: 'Y TÚ PODRÁS DECIR:', at: 6}}
          items={[
            {text: '«YO ESTUVE', at: 41},
            {text: 'DESDE EL', at: 49},
            {text: 'DÍA UNO»', at: 58, gold: true, size: 120},
          ]}
          size={86}
          exitAt={106}
        />
      </Sequence>

      {/* 3 — Presentación */}
      <Sequence name="E3 Llanura Ámbar" from={216} durationInFrames={52}>
        <EditorialLabel text="LLANURA ÁMBAR" duration={52} />
      </Sequence>
      <Sequence name="T3 Mi propio RPG en Roblox" from={214} durationInFrames={176}>
        <KineticText
          lines={[{segs: [{t: 'MI PROPIO '}, {t: 'RPG', c: C.cyan}]}, {segs: [{t: 'EN ROBLOX'}], size: 96}]}
          size={86}
          exitAt={166}
          sweepAt={22}
        />
      </Sequence>

      {/* 4 — Invitación */}
      <Sequence name="E4a Explora" from={392} durationInFrames={28}>
        <EditorialLabel text="EXPLORA" duration={28} />
      </Sequence>
      <Sequence name="E4d Descubre" from={482} durationInFrames={42}>
        <EditorialLabel text="DESCUBRE" duration={42} />
      </Sequence>
      <Sequence name="T4 ¡Ven a probarlo!" from={392} durationInFrames={178}>
        <ImpactTitle
          lines={[{segs: [{t: '¡VEN A'}]}, {segs: [{t: 'PROBARLO!', c: C.cyan}], size: 118}]}
          size={92}
          entry={10}
          sweepAt={24}
          exitAt={168}
        />
      </Sequence>

      {/* 5 — Conexión personal */}
      {SHOW_CREATOR_TAG ? (
        <Sequence name="E5 Creador" from={572} durationInFrames={130}>
          <EditorialLabel text="CREADOR" duration={130} color={C.gold} />
        </Sequence>
      ) : null}
      <Sequence name="E5c En desarrollo" from={707} durationInFrames={43}>
        <EditorialLabel text="EN DESARROLLO" duration={43} color={C.gold} />
      </Sequence>
      <Sequence name="T5 ¡Yo estaré jugando contigo!" from={572} durationInFrames={176}>
        <KineticText
          lines={[{segs: [{t: '¡YO ESTARÉ'}]}, {segs: [{t: 'JUGANDO', c: C.cyan}]}, {segs: [{t: 'CONTIGO!', c: C.cyan}]}]}
          size={92}
          stagger={5}
          exitAt={166}
          sweepAt={26}
        />
      </Sequence>

      {/* 6 — Momento emocional */}
      <Sequence name="T6 Recordaré a los del día uno" from={836} durationInFrames={122}>
        <GoldenReveal
          items={[
            {text: 'RECORDARÉ', at: 0, size: 92},
            {text: 'A LOS DEL', at: 14},
            {text: 'DÍA UNO', at: 64, gold: true, size: 132},
          ]}
          size={80}
          exitAt={112}
        />
      </Sequence>

      {/* 7 — Cierre viral */}
      <Sequence name="T7 CTA" from={960} durationInFrames={180}>
        <CommentCTA enterAt={8} likeAt={37} commentAt={57} phraseAt={88} />
      </Sequence>

      {/* Subtítulos sincronizados con la voz */}
      <MotionSubtitle segments={daySubtitles} />

      {/* ---------- AUDIO ---------- */}
      <AudioTimeline />
    </AbsoluteFill>
  );
};

// Barrido luminoso diagonal sobre la banda de gameplay (transición / destello del gancho).
const BandSweep: React.FC<{duration: number; strength?: number}> = ({duration, strength = 0.5}) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, duration], [-60, 160], {...clamp, easing: easeInOut});
  const a = interpolate(frame, [0, duration * 0.25, duration * 0.75, duration], [0, strength, strength, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 0, top: WIN.top, width: WIN.width, height: WIN.height, overflow: 'hidden', mixBlendMode: 'screen'}}>
      <div
        style={{
          position: 'absolute',
          top: -200,
          bottom: -200,
          left: `${x}%`,
          width: 340,
          translate: '-50% 0px',
          rotate: '18deg',
          opacity: a,
          background: 'linear-gradient(90deg, rgba(255,240,210,0) 0%, rgba(255,240,210,0.5) 42%, rgba(255,255,255,0.95) 50%, rgba(255,240,210,0.5) 58%, rgba(255,240,210,0) 100%)',
          filter: 'blur(6px)',
        }}
      />
    </div>
  );
};
