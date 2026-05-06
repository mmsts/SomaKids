type Mood = 'idle' | 'thinking' | 'happy' | 'soothe';

interface Props {
  mood?: Mood;
  size?: number;
  className?: string;
}

export function Companion({ mood = 'idle', size = 96, className = '' }: Props) {
  return (
    <div
      className={`relative inline-block animate-float ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* outer glow */}
      <div className="absolute inset-[-20%] rounded-full bg-grad-dawn opacity-50 blur-2xl animate-breathe" />

      <svg viewBox="0 0 120 120" className="relative w-full h-full drop-shadow-[0_8px_32px_rgba(164,142,255,0.45)]">
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
        </defs>

        {/* blob body */}
        <path
          d="M60,8 C86,4 112,28 108,58 C116,86 86,116 58,112 C28,118 4,86 12,58 C8,28 34,8 60,8 Z"
          fill="url(#companion-fill)"
        />

        {/* cheeks */}
        <ellipse cx="38" cy="74" rx="9" ry="5" fill="url(#companion-cheek)" />
        <ellipse cx="82" cy="74" rx="9" ry="5" fill="url(#companion-cheek)" />

        {/* eyes */}
        {mood === 'soothe' ? (
          <>
            <path d="M40,60 Q46,64 52,60" stroke="#1A1B47" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M68,60 Q74,64 80,60" stroke="#1A1B47" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="46" cy="60" r="3.6" fill="#1A1B47" />
            <circle cx="74" cy="60" r="3.6" fill="#1A1B47" />
            {/* tiny eye highlights */}
            <circle cx="47.4" cy="58.6" r="1.1" fill="#FFFFFF" opacity="0.9" />
            <circle cx="75.4" cy="58.6" r="1.1" fill="#FFFFFF" opacity="0.9" />
          </>
        )}

        {/* mouth */}
        {mood === 'thinking' && (
          <path d="M54,82 Q60,80 66,82" stroke="#1A1B47" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}
        {mood === 'idle' && (
          <path d="M52,80 Q60,86 68,80" stroke="#1A1B47" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}
        {mood === 'happy' && (
          <path d="M50,78 Q60,90 70,78" stroke="#1A1B47" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        )}
        {mood === 'soothe' && (
          <path d="M54,82 Q60,86 66,82" stroke="#1A1B47" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        )}
      </svg>

      {mood === 'thinking' && (
        <div className="absolute -top-2 right-1 flex gap-1 px-2 py-1 rounded-full glass">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-1.5 h-1.5 rounded-full bg-accent-glow animate-dot-bounce"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
