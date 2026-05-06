/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0E1033',
          elevated: '#1A1B47',
          raised: '#252862',
        },
        brand: {
          primary: '#8B7FE8',
          secondary: '#6BB8FF',
        },
        accent: {
          glow: '#A48EFF',
        },
        emo: {
          joy: '#FFD59E',
          calm: '#A8E0CC',
          sad: '#8BB8E8',
          anxious: '#C8A8E8',
          ache: '#FF9E9E',
          tired: '#B8B8D8',
          itch: '#FFC8E0',
        },
        ink: {
          primary: '#F4F4FF',
          secondary: '#C8C8E8',
          tertiary: '#8B8BB8',
          disabled: '#5B5B82',
          onLight: '#1A1B47',
        },
        state: {
          success: '#7FE8B8',
          warn: '#FFD08B',
          error: '#FF9EB0',
          info: '#8BC8FF',
        },
      },
      backgroundImage: {
        'grad-aurora': 'linear-gradient(135deg, #7B6BFF 0%, #5DA8FF 100%)',
        'grad-dusk': 'linear-gradient(160deg, #8B5FE8 0%, #4F7FE8 100%)',
        'grad-dawn': 'linear-gradient(145deg, #FFB8D8 0%, #A48EFF 100%)',
        'grad-calm': 'linear-gradient(180deg, #3B3F8C 0%, #1A1B47 100%)',
      },
      borderRadius: {
        xs: '8px',
        sm: '12px',
        DEFAULT: '16px',
        lg: '20px',
        xl: '28px',
        '2xl': '36px',
      },
      boxShadow: {
        'glow-soft': '0 0 40px rgba(139, 127, 232, 0.25)',
        'glow-medium': '0 8px 60px rgba(139, 127, 232, 0.35)',
        'glow-strong': '0 0 80px rgba(164, 142, 255, 0.50)',
        sink: '0 4px 24px rgba(14, 16, 51, 0.4)',
        'btn-primary': '0 8px 32px rgba(123, 107, 255, 0.4)',
        'btn-primary-hover': '0 12px 48px rgba(123, 107, 255, 0.55)',
      },
      fontFamily: {
        sans: [
          '"PingFang SC"',
          '"SF Pro Rounded"',
          '"HarmonyOS Sans"',
          'Inter',
          'Nunito',
          'system-ui',
          'sans-serif',
        ],
      },
      letterSpacing: {
        soft: '0.02em',
        tight: '-0.01em',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'fade-up': 'fade-up 360ms cubic-bezier(0.4, 0, 0.2, 1) both',
        'fade-in': 'fade-in 320ms cubic-bezier(0.4, 0, 0.2, 1) both',
        breathe: 'breathe 4.2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 1.5s ease-in-out infinite',
        'dot-bounce': 'dot-bounce 1.2s ease-in-out infinite',
        'aurora-drift': 'aurora-drift 20s ease-in-out infinite alternate',
        jelly: 'jelly 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '50%': { transform: 'scale(1.04)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        'dot-bounce': {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '40%': { transform: 'translateY(-4px)', opacity: '1' },
        },
        'aurora-drift': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(40px, -30px) scale(1.08)' },
        },
        jelly: {
          '0%': { transform: 'scale(1, 1)' },
          '25%': { transform: 'scale(0.94, 1.08)' },
          '50%': { transform: 'scale(1.06, 0.94)' },
          '75%': { transform: 'scale(0.98, 1.03)' },
          '100%': { transform: 'scale(1, 1)' },
        },
      },
    },
  },
  plugins: [],
};
