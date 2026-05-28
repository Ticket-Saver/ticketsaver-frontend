/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      height: {
        50: '12.5rem',
        84: '24.5rem'
      },
      width: {
        96: '24rem',
        115: '35rem'
      },
      typography: {
        DEFAULT: {
          css: {
            backgroundColor: 'white !important'
          }
        }
      },
      colors: {
        brand: {
          ink: '#0E0820',
          lo: '#8A5BC7',
          mid: '#B57BE8',
          hi: '#D4A8F0',
          50: '#F3E8FB',
          100: '#E5CFF5',
          200: '#D4A8F0',
          300: '#C18EE9',
          400: '#B57BE8',
          500: '#9D63D8',
          600: '#8A5BC7',
          700: '#6E45A1',
          800: '#4A2F70',
          900: '#1A0F33'
        },
        accent: {
          pink: '#FF5E9E',
          mint: '#7DFFB0',
          coral: '#FFB1C8',
          amber: '#FFE0A0',
          aqua: '#B0F0FF'
        },
        surface: {
          'glass-5': 'rgba(255,255,255,0.05)',
          'glass-8': 'rgba(255,255,255,0.08)',
          'glass-12': 'rgba(255,255,255,0.12)',
          'glass-18': 'rgba(255,255,255,0.18)',
          'border-soft': 'rgba(255,255,255,0.10)',
          'border-mid': 'rgba(255,255,255,0.14)',
          'border-strong': 'rgba(255,255,255,0.22)'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        pill: '9999px',
        'glass-sm': '12px',
        'glass-md': '18px',
        'glass-lg': '24px',
        'glass-xl': '28px'
      },
      boxShadow: {
        glass: '0 10px 30px rgba(0,0,0,0.35)',
        'glass-hover': '0 16px 40px rgba(0,0,0,0.45)',
        'glass-deep': '0 20px 50px rgba(0,0,0,0.45)',
        'pill-warn': '0 4px 16px rgba(255,177,200,0.30)',
        'pill-critical': '0 4px 18px rgba(255,90,110,0.45)',
        'cover-glow': '0 4px 16px rgba(181,123,232,0.40)',
        'brand-glow': '0 4px 14px rgba(181,123,232,0.50)'
      },
      backdropBlur: {
        glass: '14px',
        'glass-strong': '24px',
        'glass-hero': '40px'
      },
      backdropSaturate: {
        glass: '160%'
      },
      keyframes: {
        'pulse-you': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.55', transform: 'scale(1.08)' }
        },
        'pill-warn-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        },
        'mesh-fadein': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'cover-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'drawer-fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'drawer-slide-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'drawer-slide-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'drawer-slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' }
        }
      },
      animation: {
        'pulse-you': 'pulse-you 1.4s ease-in-out infinite',
        'pill-warn-blink': 'pill-warn-blink 1.2s ease-in-out infinite',
        'mesh-fadein': 'mesh-fadein 600ms ease-out forwards',
        'cover-shimmer': 'cover-shimmer 2.4s linear infinite',
        'drawer-fade-in': 'drawer-fade-in 200ms ease-out',
        'drawer-slide-right':
          'drawer-slide-right 280ms cubic-bezier(.16,1,.3,1)',
        'drawer-slide-left':
          'drawer-slide-left 280ms cubic-bezier(.16,1,.3,1)',
        'drawer-slide-up':
          'drawer-slide-up 280ms cubic-bezier(.16,1,.3,1)'
      },
      zIndex: {
        'mesh-bg': '-1',
        nav: '40',
        pill: '45',
        drawer: '60',
        'bottom-sheet': '55',
        toast: '70',
        modal: '80'
      }
    },
    container: {
      center: true,
      padding: '1.25rem',
      screens: {
        'x-sm': '400px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '1200px'
      }
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif']
    }
  },
  plugins: [typography]
}
