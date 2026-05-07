import { motion, AnimatePresence } from 'framer-motion';
import type { CompanionMood, MoodConfig } from '../lib/companionConfig';
import { MOOD_CONFIG } from '../lib/companionConfig';

interface Props {
  mood?: CompanionMood;
  size?: number;
  className?: string;
}

export function Companion({ mood = 'happy', size = 96, className = '' }: Props) {
  const cfg = MOOD_CONFIG[mood];

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Particles layer */}
      {cfg.particles.type !== 'none' && (
        <div className="absolute inset-0 pointer-events-none">
          <Particles mood={mood} size={size} />
        </div>
      )}

      <motion.div
        className="relative w-full h-full"
        aria-hidden
        animate={{
          y: cfg.floatY,
          x: cfg.floatX,
          rotate: cfg.floatRotate,
          scale: cfg.scale,
        }}
        transition={{
          duration: cfg.floatDuration,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        }}
        style={{ filter: `brightness(${cfg.brightness})` }}
      >
        {/* outer glow */}
        <motion.div
          className={`absolute inset-[-20%] rounded-full ${cfg.glowBlur}`}
          style={{ background: cfg.glowColor }}
          animate={{
            opacity: cfg.glowOpacity,
            scale: cfg.glowScale,
          }}
          transition={{
            duration: cfg.glowDuration,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        />

        <svg
          viewBox="0 0 120 120"
          className="relative w-full h-full drop-shadow-[0_8px_32px_rgba(164,142,255,0.45)]"
        >
          <defs>
            <radialGradient id="companion-fill" cx="38%" cy="32%" r="78%">
              <stop offset="0%" stopColor="#FFE9F2" />
              <stop offset="55%" stopColor="#FFB8D8" />
              <stop offset="100%" stopColor="#A48EFF" />
            </radialGradient>
            <radialGradient id="companion-cheek" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF9EB0" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FF9EB0" stopOpacity="0" />
            </radialGradient>
            {/* Extra glow for happy state */}
            <radialGradient id="happy-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD59E" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FFD59E" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* blob body */}
          <path
            d="M60,8 C86,4 112,28 108,58 C116,86 86,116 58,112 C28,118 4,86 12,58 C8,28 34,8 60,8 Z"
            fill="url(#companion-fill)"
          />

          {/* Extra body glow for happy */}
          {mood === 'happy' && (
            <ellipse cx="60" cy="60" rx="35" ry="38" fill="url(#happy-glow)" />
          )}

          {/* cheeks — more prominent for happy */}
          <ellipse
            cx="38"
            cy="74"
            rx={mood === 'happy' ? 11 : 9}
            ry={mood === 'happy' ? 6 : 5}
            fill="url(#companion-cheek)"
          />
          <ellipse
            cx="82"
            cy="74"
            rx={mood === 'happy' ? 11 : 9}
            ry={mood === 'happy' ? 6 : 5}
            fill="url(#companion-cheek)"
          />

          {/* eyes */}
          <Eyes type={cfg.eyes} />

          {/* mouth */}
          <path
            d={cfg.mouthPath}
            stroke="#1A1B47"
            strokeWidth={cfg.mouthStrokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* thinking dots */}
        {cfg.hasThinkingDots && (
          <div className="absolute -top-2 right-1 flex gap-1 px-2 py-1 rounded-full glass">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block w-1.5 h-1.5 rounded-full bg-accent-glow"
                animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.18,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Eyes Component ─── */
function Eyes({ type }: { type: MoodConfig['eyes'] }) {
  switch (type) {
    case 'joyful':
      return (
        <g>
          {/* Happy arched eyes (> < shape) */}
          <path
            d="M40,58 Q46,50 52,58"
            stroke="#1A1B47"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M68,58 Q74,50 80,58"
            stroke="#1A1B47"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      );

    case 'wide':
      return (
        <g>
          {/* Larger open eyes with highlights */}
          <circle cx="46" cy="60" r="4.2" fill="#1A1B47" />
          <circle cx="74" cy="60" r="4.2" fill="#1A1B47" />
          <circle cx="48" cy="58.2" r="1.4" fill="#FFFFFF" opacity="0.95" />
          <circle cx="76" cy="58.2" r="1.4" fill="#FFFFFF" opacity="0.95" />
          <circle cx="46.5" cy="61.5" r="0.7" fill="#FFFFFF" opacity="0.6" />
          <circle cx="74.5" cy="61.5" r="0.7" fill="#FFFFFF" opacity="0.6" />
        </g>
      );

    case 'looking-up':
      return (
        <g>
          {/* Eyes looking upward (positioned higher) */}
          <circle cx="46" cy="55" r="3.2" fill="#1A1B47" />
          <circle cx="74" cy="55" r="3.2" fill="#1A1B47" />
          <circle cx="47.4" cy="53.6" r="1" fill="#FFFFFF" opacity="0.9" />
          <circle cx="75.4" cy="53.6" r="1" fill="#FFFFFF" opacity="0.9" />
        </g>
      );

    case 'looking-down':
      return (
        <g>
          {/* Droopy eyes looking down */}
          <path
            d="M42,63 Q46,58 50,63"
            stroke="#1A1B47"
            strokeWidth="2.8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M70,63 Q74,58 78,63"
            stroke="#1A1B47"
            strokeWidth="2.8"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      );

    case 'closed':
      return (
        <g>
          <path
            d="M40,60 Q46,65 52,60"
            stroke="#1A1B47"
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M68,60 Q74,65 80,60"
            stroke="#1A1B47"
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      );

    case 'open':
    default:
      return (
        <g>
          <circle cx="46" cy="60" r="3.6" fill="#1A1B47" />
          <circle cx="74" cy="60" r="3.6" fill="#1A1B47" />
          <circle cx="47.4" cy="58.6" r="1.1" fill="#FFFFFF" opacity="0.9" />
          <circle cx="75.4" cy="58.6" r="1.1" fill="#FFFFFF" opacity="0.9" />
        </g>
      );
  }
}

/* ─── Particles Component ─── */
function Particles({ mood, size }: { mood: CompanionMood; size: number }) {
  const cfg = MOOD_CONFIG[mood].particles;

  if (cfg.type === 'none') return null;

  return (
    <AnimatePresence>
      {Array.from({ length: cfg.count }, (_, i) => {
        const angle = (i / cfg.count) * Math.PI * 2;
        const radius = size * 0.55;
        const delay = i * 0.4;

        if (cfg.type === 'sparkle') {
          return (
            <motion.div
              key={`${mood}-sparkle-${i}`}
              className="absolute rounded-full"
              style={{
                width: cfg.size,
                height: cfg.size,
                background: cfg.color,
                left: '50%',
                top: '50%',
                marginLeft: -cfg.size / 2,
                marginTop: -cfg.size / 2,
                boxShadow: `0 0 ${cfg.size * 2}px ${cfg.color}`,
              }}
              animate={{
                x: [
                  Math.cos(angle) * radius,
                  Math.cos(angle + Math.PI * 0.5) * radius * 0.7,
                  Math.cos(angle + Math.PI) * radius,
                  Math.cos(angle + Math.PI * 1.5) * radius * 0.7,
                  Math.cos(angle) * radius,
                ],
                y: [
                  Math.sin(angle) * radius,
                  Math.sin(angle + Math.PI * 0.5) * radius * 0.7,
                  Math.sin(angle + Math.PI) * radius,
                  Math.sin(angle + Math.PI * 1.5) * radius * 0.7,
                  Math.sin(angle) * radius,
                ],
                opacity: [0.2, 0.9, 0.2, 0.7, 0.2],
                scale: [0.6, 1.3, 0.6, 1.1, 0.6],
              }}
              transition={{
                duration: 3 + i * 0.6,
                repeat: Infinity,
                delay,
                ease: 'easeInOut',
              }}
            />
          );
        }

        if (cfg.type === 'orbit') {
          return (
            <motion.div
              key={`${mood}-orbit-${i}`}
              className="absolute rounded-full"
              style={{
                width: cfg.size,
                height: cfg.size,
                background: cfg.color,
                left: '50%',
                top: '50%',
                marginLeft: -cfg.size / 2,
                marginTop: -cfg.size / 2,
              }}
              animate={{
                x: [
                  Math.cos(angle) * radius,
                  Math.cos(angle + Math.PI * 0.5) * radius * 1.1,
                  Math.cos(angle + Math.PI) * radius,
                  Math.cos(angle + Math.PI * 1.5) * radius * 1.1,
                  Math.cos(angle) * radius,
                ],
                y: [
                  Math.sin(angle) * radius,
                  Math.sin(angle + Math.PI * 0.5) * radius * 1.1,
                  Math.sin(angle + Math.PI) * radius,
                  Math.sin(angle + Math.PI * 1.5) * radius * 1.1,
                  Math.sin(angle) * radius,
                ],
                opacity: [0.3, 0.6, 0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 5 + i * 0.8,
                repeat: Infinity,
                delay,
                ease: 'easeInOut',
              }}
            />
          );
        }

        if (cfg.type === 'float-up') {
          const startX = (Math.random() - 0.5) * size * 0.6;
          return (
            <motion.div
              key={`${mood}-float-${i}`}
              className="absolute rounded-full"
              style={{
                width: cfg.size,
                height: cfg.size,
                background: cfg.color,
                left: `calc(50% + ${startX}px)`,
                top: '60%',
                marginLeft: -cfg.size / 2,
                marginTop: -cfg.size / 2,
              }}
              animate={{
                y: [0, -size * 0.8, -size * 1.2],
                x: [0, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.7,
                repeat: Infinity,
                delay: i * 1.2,
                ease: 'easeOut',
              }}
            />
          );
        }

        return null;
      })}
    </AnimatePresence>
  );
}
