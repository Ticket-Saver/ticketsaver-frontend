/** @type {import('tailwindcss').Config} */
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
      sans: ['Montserrat', 'sans-serif']
    }
  },
  daisyui: {
    themes: ['light', 'synthwave', 'cupcake', 'halloween']
  },
  plugins: [require('daisyui'), require('@tailwindcss/typography')]
}
