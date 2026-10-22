import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {fonts, LAYOUT, palette, WINDOW} from '../styles/palette';
import {clamp, easeOut} from './anim';
import {Sweep} from './KineticTitle';

// Escena 9: nombre oficial del juego (tal como aparece en su pantalla de título)
// con tratamiento tipográfico propio + llamada a la acción.
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();

  // Oscurece la ventana para que el título respire.
  const dim = interpolate(frame, [0, 24], [0, 0.5], {...clamp, easing: easeOut});

  // Título: escala + opacidad + desenfoque.
  const t = interpolate(frame, [8, 30], [0, 1], {...clamp, easing: easeOut});
  const glow = interpolate(frame, [20, 40, 75, 150], [0, 1, 0.55, 0.7], clamp);
  const pre = interpolate(frame, [4, 20], [0, 1], {...clamp, easing: easeOut});
  const sub = interpolate(frame, [26, 42], [0, 1], {...clamp, easing: easeOut});
  const rule = interpolate(frame, [22, 46], [0, 1], {...clamp, easing: easeOut});

  // CTA después del título.
  const cta = interpolate(frame, [44, 58], [0, 1], {...clamp, easing: easeOut});
  const cta2 = interpolate(frame, [54, 68], [0, 1], {...clamp, easing: easeOut});
  const top = interpolate(frame, [12, 28], [0, 1], {...clamp, easing: easeOut});

  const center = WINDOW.top + WINDOW.height / 2;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: WINDOW.top,
          height: WINDOW.height,
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, rgba(11,16,32,${dim * 0.75}) 0%, rgba(11,16,32,${dim}) 100%)`,
        }}
      />

      {/* Etiqueta superior (texto de la propia pantalla de título del juego) */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: LAYOUT.sideMargin,
          right: LAYOUT.sideMargin,
          textAlign: 'center',
          fontFamily: fonts.text,
          fontWeight: 600,
          fontSize: 27,
          letterSpacing: '0.26em',
          color: palette.paper,
          opacity: top * 0.85,
          translate: `0px ${(1 - top) * 14}px`,
        }}
      >
        UN JUEGO ORIGINAL
        <div style={{color: palette.cyan, marginTop: 10, fontSize: 24}}>EN DESARROLLO</div>
      </div>

      {/* Nombre del juego */}
      <div
        style={{
          position: 'absolute',
          left: 40,
          right: 40,
          top: center,
          translate: '0px -50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontFamily: fonts.text,
            fontWeight: 800,
            fontSize: 36,
            letterSpacing: '0.42em',
            marginRight: '-0.42em',
            color: palette.gold,
            opacity: pre,
            translate: `0px ${(1 - pre) * 16}px`,
            textShadow: '0 2px 12px rgba(11,16,32,0.8)',
          }}
        >
          THE LEGEND OF
        </div>
        <div
          style={{
            position: 'relative',
            marginTop: 6,
            fontFamily: fonts.display,
            fontSize: 132,
            lineHeight: 1,
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            color: palette.paper,
            opacity: t,
            scale: String(1.14 - 0.14 * t),
            filter: `blur(${(1 - t) * 14}px) drop-shadow(0 0 ${16 + 18 * glow}px rgba(243,201,105,${0.5 * glow})) drop-shadow(0 8px 18px rgba(11,16,32,0.75))`,
          }}
        >
          <span
            style={{
              backgroundImage: `linear-gradient(180deg, ${palette.paper} 0%, ${palette.paper} 42%, ${palette.gold} 100%)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              textShadow: 'none',
            }}
          >
            YOUR SELF
          </span>
          <Sweep text="YOUR SELF" frame={frame - 34} duration={20} />
        </div>
        <div
          style={{
            marginTop: 22,
            width: 520 * rule,
            height: 2,
            background: `linear-gradient(90deg, ${palette.gold}00, ${palette.gold}, ${palette.gold}00)`,
          }}
        />
        <div
          style={{
            marginTop: 18,
            fontFamily: fonts.text,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: '0.16em',
            color: palette.paper,
            opacity: sub * 0.92,
            translate: `0px ${(1 - sub) * 12}px`,
            textShadow: '0 2px 12px rgba(11,16,32,0.8)',
          }}
        >
          LA LEYENDA DEL TÚMULO HUECO
        </div>
      </div>

      {/* Llamada a la acción, por encima de la zona de controles de TikTok */}
      <div
        style={{
          position: 'absolute',
          top: LAYOUT.subtitleTop - 8,
          left: LAYOUT.sideMargin - 30,
          right: LAYOUT.sideMargin - 30,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 70,
            lineHeight: 1,
            color: palette.paper,
            whiteSpace: 'nowrap',
            opacity: cta,
            scale: String(0.94 + 0.06 * cta),
            translate: `0px ${(1 - cta) * 20}px`,
            textShadow: `0 0 26px ${palette.cyan}55, 0 6px 22px rgba(11,16,32,0.6)`,
          }}
        >
          SIGUE EL <span style={{color: palette.cyan}}>DESARROLLO</span>
        </div>
        <div
          style={{
            fontFamily: fonts.text,
            fontWeight: 600,
            fontSize: 38,
            letterSpacing: '0.06em',
            color: palette.gold,
            opacity: cta2,
            translate: `0px ${(1 - cta2) * 14}px`,
            textShadow: '0 2px 12px rgba(11,16,32,0.8)',
          }}
        >
          PRÓXIMAMENTE, MÁS NOVEDADES
        </div>
      </div>
    </AbsoluteFill>
  );
};
