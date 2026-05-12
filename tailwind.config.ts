import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import containerQueries from '@tailwindcss/container-queries';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4F46E5',
          primaryHover: '#4338CA',
          primarySoft: '#EEF2FF',
          accent: '#22D3EE',
          sidebar: '#1B1F3A',
          sidebarHover: '#252A4A',
          sidebarActive: '#2E3357',
          sidebarText: '#B8BCD0',
          sidebarTextActive: '#FFFFFF',
        },
        surface: {
          canvas: '#F7F7FA',
          card: '#FFFFFF',
          subtle: '#F1F2F6',
          border: '#E5E7EB',
        },
        ink: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
          subtle: '#CBD5E1',
        },
        accent: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
        },
        kakao: {
          bg: '#B2C7DA',
          bubble: '#FEE500',
          bubbleAlt: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          '"Apple SD Gothic Neo"',
          '"Noto Sans KR"',
          'sans-serif',
        ],
      },
      borderRadius: {
        xl: '0.875rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 1px rgba(15, 23, 42, 0.03)',
        elev: '0 8px 24px -8px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.04)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'backdrop-fade': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'modal-pop': {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(6px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'modal-slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'highlight-sweep': {
          '0%': { backgroundPosition: '-60% 0', opacity: '1' },
          '60%': { opacity: '1' },
          '100%': { backgroundPosition: '160% 0', opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'backdrop-fade': 'backdrop-fade 160ms ease-out',
        'modal-pop': 'modal-pop 220ms cubic-bezier(0.22, 1, 0.36, 1)',
        'modal-slide-up': 'modal-slide-up 260ms cubic-bezier(0.22, 1, 0.36, 1)',
        'highlight-sweep': 'highlight-sweep 1.6s ease-out forwards',
      },
    },
  },
  plugins: [animate, containerQueries],
};

export default config;
