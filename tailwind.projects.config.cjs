module.exports = {
  content: [
    './projects/**/*.html',
    './projects/**/*.js',
    './assets/js/rdp-project-shell.js'
  ],
  theme: {
    extend: {
      colors: {
        deepBlue: '#166b5d',
        vibrantCyan: '#b2d98b',
        trustGreen: '#166b5d',
        darkSlate: '#061611',
        techGray: '#29483d',
        energeticAmber: '#f59e0b',
        dangerRed: '#ef4444',
        glass: 'rgba(22, 107, 93, 0.22)',
        mysteryPurple: '#8b5cf6',
        softRose: '#fb7185',
        softAmber: '#f59e0b',
        softViolet: '#a78bfa'
      },
      fontFamily: {
        sans: ['Manrope', '"Segoe UI Variable"', '"Segoe UI"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn .6s ease-out forwards',
        'fade-in-up': 'fadeInUp .9s cubic-bezier(.16,1,.3,1) forwards',
        'pulse-soft': 'pulseSoft 3.2s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(.4,0,.6,1) infinite',
        'float-soft': 'floatSoft 8s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
}
