/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          pink: '#ff2f92',
          purple: '#8a2be2',
          maroon: '#800020',
          gold: '#D4AF37',
          cream: '#FFF8E7',
          charcoal: '#1F1F1F',
        },
        theme: {
          pink: '#ff2f92',
          purple: '#8a2be2',
        },
        secondary: {
          light: '#FFF5E6',
          dark: '#4A4A4A',
        }
      },
      backgroundImage: {
        'gradient-pink-purple': 'linear-gradient(135deg, #ff2f92 0%, #8a2be2 100%)',
        'gradient-pink-purple-soft': 'linear-gradient(135deg, rgba(255,47,146,0.1) 0%, rgba(138,43,226,0.1) 100%)',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'Poppins', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 25px -5px rgba(212, 175, 55, 0.3)',
        'glow': '0 0 20px rgba(212, 175, 55, 0.5)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-lg': '0 8px 32px 0 rgba(255, 47, 146, 0.1)',
        'soft': '0 4px 20px rgba(138, 43, 226, 0.12)',
        'glass-card': '0 8px 32px 0 rgba(255, 47, 146, 0.08), 0 2px 8px rgba(138, 43, 226, 0.06)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-gold': 'pulseGold 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(212, 175, 55, 0)' },
        }
      }
    },
  },
  plugins: [],
}