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
        'caveat': ['Caveat', 'cursive'],
        'patrick': ['Patrick Hand', 'cursive'],
        'indie': ['Indie Flower', 'cursive'],
      },
      colors: {
        'notebook': {
          paper: '#fef9f0',
          line: '#b8d4f0',
          margin: '#f4a0a0',
          ring: '#8b8b8b',
          ink: '#2c2c6e',
          pencil: '#555555',
          doodle: '#3a3a5c',
        }
      },
      backgroundImage: {
        'notebook-lines': 'repeating-linear-gradient(transparent, transparent 31px, #b8d4f0 31px, #b8d4f0 32px)',
      },
      boxShadow: {
        'notebook': '2px 3px 8px rgba(0,0,0,0.15), -1px -1px 3px rgba(0,0,0,0.05)',
        'ring': 'inset 0 0 0 3px #8b8b8b',
      }
    },
  },
  plugins: [],
}
