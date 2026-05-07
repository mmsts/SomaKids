export type CompanionMood = 'happy' | 'listening' | 'thinking' | 'relieved' | 'worried';

export interface ParticleConfig {
  type: 'sparkle' | 'orbit' | 'float-up' | 'none';
  count: number;
  color: string;
  size: number;
}

export interface MoodConfig {
  eyes: 'open' | 'closed' | 'looking-up' | 'looking-down' | 'wide' | 'joyful';
  mouthPath: string;
  mouthStrokeWidth: number;
  glowColor: string;
  glowOpacity: number[];
  glowScale: number[];
  glowDuration: number;
  glowBlur: string;
  floatY: number[];
  floatX: number[];
  floatRotate: number[];
  floatDuration: number;
  scale: number[];
  scaleDuration: number;
  brightness: number;
  hasThinkingDots: boolean;
  particles: ParticleConfig;
  captions: string[];
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getCaption(mood: CompanionMood): string | null {
  const cfg = MOOD_CONFIG[mood];
  if (!cfg.captions.length) return null;
  return pick(cfg.captions);
}

export const MOOD_CONFIG: Record<CompanionMood, MoodConfig> = {
  happy: {
    eyes: 'joyful',
    mouthPath: 'M48,76 Q60,94 72,76',
    mouthStrokeWidth: 2.8,
    glowColor: 'linear-gradient(145deg, #FFB8D8 0%, #E8A0FF 50%, #A48EFF 100%)',
    glowOpacity: [0.45, 0.75, 0.45],
    glowScale: [1, 1.12, 1],
    glowDuration: 2.4,
    glowBlur: 'blur-2xl',
    floatY: [0, -10, 0],
    floatX: [0, 0, 0],
    floatRotate: [0, 0, 0],
    floatDuration: 2.6,
    scale: [1, 1.06, 1],
    scaleDuration: 2.4,
    brightness: 1.08,
    hasThinkingDots: false,
    particles: {
      type: 'sparkle',
      count: 4,
      color: 'rgba(255, 213, 158, 0.7)',
      size: 4,
    },
    captions: [
      '耶～我知道啦！',
      '今天也想陪着你~',
      '我在这里哦 ✨',
      '好开心见到你！',
    ],
  },

  listening: {
    eyes: 'wide',
    mouthPath: 'M52,80 Q60,84 68,80',
    mouthStrokeWidth: 2.4,
    glowColor: 'linear-gradient(145deg, #D0C0FF 0%, #A090E8 100%)',
    glowOpacity: [0.4, 0.55, 0.4],
    glowScale: [1, 1.04, 1],
    glowDuration: 2.8,
    glowBlur: 'blur-2xl',
    floatY: [0, -2, 0],
    floatX: [0, 3, 0],
    floatRotate: [0, 2, 0],
    floatDuration: 3,
    scale: [1, 1.02, 1],
    scaleDuration: 3,
    brightness: 1.02,
    hasThinkingDots: false,
    particles: {
      type: 'none',
      count: 0,
      color: '',
      size: 0,
    },
    captions: [
      '我在认真听你说…',
      '慢慢说，不急…',
      '我在陪着你…',
      '你说，我听…',
    ],
  },

  thinking: {
    eyes: 'looking-up',
    mouthPath: 'M54,82 Q60,80 66,82',
    mouthStrokeWidth: 2.5,
    glowColor: 'linear-gradient(145deg, #C0B0F0 0%, #8B7FE8 100%)',
    glowOpacity: [0.25, 0.42, 0.25],
    glowScale: [0.96, 1.04, 0.96],
    glowDuration: 4.2,
    glowBlur: 'blur-2xl',
    floatY: [0, -3, 0],
    floatX: [0, 0, 0],
    floatRotate: [0, 0, 0],
    floatDuration: 4.5,
    scale: [0.98, 1.02, 0.98],
    scaleDuration: 4.2,
    brightness: 0.96,
    hasThinkingDots: true,
    particles: {
      type: 'float-up',
      count: 2,
      color: 'rgba(200, 190, 255, 0.4)',
      size: 5,
    },
    captions: [
      '让我想一想…',
      '嗯……让我猜猜看…',
      '我好像明白一点了…',
      '这个感觉有点像……',
    ],
  },

  relieved: {
    eyes: 'closed',
    mouthPath: 'M54,82 Q60,87 66,82',
    mouthStrokeWidth: 2.5,
    glowColor: 'linear-gradient(145deg, #FFE0F0 0%, #D0C0FF 50%, #B0A0E8 100%)',
    glowOpacity: [0.35, 0.7, 0.35],
    glowScale: [1, 1.15, 1],
    glowDuration: 4,
    glowBlur: 'blur-3xl',
    floatY: [0, -5, -1, 0],
    floatX: [0, 0, 0],
    floatRotate: [0, 0, 0],
    floatDuration: 5,
    scale: [1, 1.04, 1],
    scaleDuration: 4,
    brightness: 1.05,
    hasThinkingDots: false,
    particles: {
      type: 'orbit',
      count: 3,
      color: 'rgba(255, 200, 220, 0.35)',
      size: 4,
    },
    captions: [
      '我听懂啦~',
      '谢谢你愿意告诉我~',
      '没关系，有我在呢',
      '你已经很勇敢了',
    ],
  },

  worried: {
    eyes: 'looking-down',
    mouthPath: 'M52,85 Q60,82 68,85',
    mouthStrokeWidth: 2.4,
    glowColor: 'linear-gradient(145deg, #C0B8D8 0%, #9088B0 100%)',
    glowOpacity: [0.18, 0.32, 0.18],
    glowScale: [0.93, 1, 0.93],
    glowDuration: 3.2,
    glowBlur: 'blur-xl',
    floatY: [0, 4, 0],
    floatX: [0, 0, 0],
    floatRotate: [0, -1.5, 0],
    floatDuration: 3.8,
    scale: [0.97, 1, 0.97],
    scaleDuration: 3.2,
    brightness: 0.94,
    hasThinkingDots: false,
    particles: {
      type: 'none',
      count: 0,
      color: '',
      size: 0,
    },
    captions: [
      '有点担心你…',
      '要不要告诉爸爸妈妈？',
      '我在这里陪着你…',
      '需要我陪你吗？',
    ],
  },
};
