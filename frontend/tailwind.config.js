/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Geist"', '"Inter Tight"', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', '"Geist"', 'serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Surface palette — warm off-black to soft cream
        ink: {
          50: '#f8f8f6',
          100: '#efefea',
          200: '#dcdcd4',
          300: '#bbbbb0',
          400: '#888880',
          500: '#5a5a54',
          600: '#3d3d39',
          700: '#28282a',
          800: '#1b1b1d',
          900: '#121214',
          950: '#08080a',
        },
        // Accent — electric lime for AI-startup punch
        accent: {
          50: '#f7ffe6',
          100: '#ecffc2',
          200: '#d8ff85',
          300: '#bdfa3d',
          400: '#a3ec0d',
          500: '#86c700',
          600: '#669900',
          700: '#4d7300',
          800: '#3f5b08',
          900: '#354d0d',
          950: '#1a2902',
        },
        // Semantic
        success: { DEFAULT: '#10b981', soft: '#d1fae5' },
        warn: { DEFAULT: '#f59e0b', soft: '#fef3c7' },
        danger: { DEFAULT: '#ef4444', soft: '#fee2e2' },
        info: { DEFAULT: '#3b82f6', soft: '#dbeafe' },
      },
      backgroundImage: {
        'grid-light':
          'linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)',
        'grid-dark':
          'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
        'noise':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        'aurora':
          'radial-gradient(ellipse 80% 60% at 20% 0%, rgba(189,250,61,0.18), transparent), radial-gradient(ellipse 60% 50% at 100% 30%, rgba(189,250,61,0.10), transparent), radial-gradient(ellipse 50% 50% at 50% 100%, rgba(255,255,255,0.04), transparent)',
      },
      backgroundSize: {
        'grid-md': '32px 32px',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
        'soft-lg': '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        'glass': 'inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 2px rgba(0,0,0,0.4)',
        'pop': '0 0 0 1px rgba(189,250,61,0.4), 0 8px 30px -8px rgba(189,250,61,0.4)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-ring': 'pulse-ring 1.6s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
