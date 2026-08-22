/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shramik: {
          navy: {
            DEFAULT: '#0B132B',
            dark: '#080E1F',
            light: '#142147',
            card: '#0F1A36',
          },
          amber: {
            DEFAULT: '#F59E0B',
            dark: '#D97706',
            light: '#FBBF24',
            warm: '#EAA228',
          },
          cream: {
            DEFAULT: '#FBFBF9',
            light: '#FFFFFF',
            dark: '#F3F4F6',
            badge: '#FEF3C7',
          },
          green: {
            DEFAULT: '#10B981',
            dark: '#059669',
            light: '#D1FAE5',
            neon: '#10B981',
          },
          slate: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          }
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 30px -5px rgba(15, 23, 42, 0.06), 0 4px 6px -2px rgba(15, 23, 42, 0.02)',
        'card-hover': '0 20px 40px -10px rgba(15, 23, 42, 0.12), 0 8px 10px -3px rgba(15, 23, 42, 0.04)',
        'glow-amber': '0 0 25px rgba(245, 158, 11, 0.35)',
        'glow-green': '0 0 25px rgba(16, 185, 129, 0.35)',
      },
      backgroundImage: {
        'hazard-stripes': 'repeating-linear-gradient(45deg, #F59E0B, #F59E0B 12px, #1E293B 12px, #1E293B 24px)',
      }
    },
  },
  plugins: [],
}
