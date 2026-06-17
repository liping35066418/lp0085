/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d4a574',
          50: '#f5f3ef',
          100: '#e8e0d4',
          200: '#d4c1a8',
          300: '#d4a574',
          400: '#c48a52',
          500: '#a87040',
          600: '#8b5a32',
        },
        surface: {
          DEFAULT: '#1a1f36',
          light: '#252b45',
          dark: '#0f1322',
          elevated: '#2a2f4a',
        },
        module: {
          introduction: '#8b7fd4',
          experiment: '#4ecdc4',
          data: '#f4a261',
          conclusion: '#e76f8d',
        },
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'slide-in-up': 'slideInUp 0.4s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'score-count': 'scoreCount 1.2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(40px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 165, 116, 0.4)' },
          '50%': { boxShadow: '0 0 20px 4px rgba(212, 165, 116, 0.2)' },
        },
      },
    },
  },
  plugins: [],
};
