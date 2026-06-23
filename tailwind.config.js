/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#020409',
          900: '#060d1f',
          800: '#0a1628',
          700: '#0f1f38',
          600: '#152848',
        },
        neon: {
          green: '#00ff88',
          emerald: '#10d97e',
          lime: '#a3ff6e',
        },
        amber: {
          glow: '#ffb300',
          warn: '#ff6b00',
        },
        sar: {
          blue: '#00c6ff',
          cyan: '#00e5ff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0,0,0.2,1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 5px rgba(0,255,136,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0,255,136,0.7), 0 0 40px rgba(0,255,136,0.3)' },
        },
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'glass-lg': '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)',
        neon: '0 0 20px rgba(0,255,136,0.4)',
        'neon-amber': '0 0 20px rgba(255,179,0,0.4)',
        'neon-sar': '0 0 20px rgba(0,198,255,0.4)',
      },
    },
  },
  plugins: [],
}
