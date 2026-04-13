/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        handwriting: ['"Caveat"', 'cursive'],
        handwriting2: ['"Kalam"', 'cursive'],
        sketch: ['"Patrick Hand"', 'cursive'],
        body: ['"Nunito"', 'sans-serif'],
      },
      colors: {
        paper: {
          50:  '#fefdf8',
          100: '#fdf9ec',
          200: '#faf3d3',
          300: '#f5e9b3',
          400: '#edd882',
          500: '#e0c45a',
        },
        ink: {
          light:  '#4a3728',
          DEFAULT:'#2c1a0e',
          dark:   '#1a0f08',
        },
        washi: {
          sage:   '#a8b89a',
          rose:   '#d4a5a5',
          sky:    '#a5c4d4',
          wheat:  '#d4c4a5',
          lavender: '#c4a5d4',
          coral:  '#d4a5a5',
          mint:   '#a5d4c4',
        },
        cork:  '#c9a87c',
        tape:  '#f0e6a0',
      },
      backgroundImage: {
        'paper-texture': "url('/textures/paper.svg')",
        'grid-lines':    "url('/textures/grid.svg')",
      },
      boxShadow: {
        'paper':    '2px 3px 8px rgba(44,26,14,0.15), 0 1px 2px rgba(44,26,14,0.08)',
        'paper-lg': '4px 6px 16px rgba(44,26,14,0.18), 0 2px 4px rgba(44,26,14,0.10)',
        'pin':      '0 2px 6px rgba(44,26,14,0.4)',
        'tape':     '1px 2px 4px rgba(44,26,14,0.12)',
        'pressed':  'inset 1px 2px 4px rgba(44,26,14,0.15)',
        'btn-sketch': '3px 3px 0px rgba(44,26,14,0.25)',
      },
      borderRadius: {
        'paper': '2px',
        'sketch': '255px 15px 225px 15px / 15px 225px 15px 255px',
      },
      animation: {
        'float':      'float 3s ease-in-out infinite',
        'wiggle':     'wiggle 0.3s ease-in-out',
        'peel':       'peel 0.4s ease-out',
        'scribble':   'scribble 0.6s ease-in-out',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px) rotate(-1deg)' },
          '50%':     { transform: 'translateY(-6px) rotate(0.5deg)' },
        },
        wiggle: {
          '0%,100%': { transform: 'rotate(-1deg)' },
          '50%':     { transform: 'rotate(1deg)' },
        },
        peel: {
          '0%':   { transform: 'scale(0.95) rotate(-2deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0deg)',     opacity: '1' },
        },
        scribble: {
          '0%':   { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
}
