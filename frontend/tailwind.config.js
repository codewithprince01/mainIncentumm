/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#090982",
        auColor: "#242699",
        auButtomColor: "#02E8FF",
        // Enhanced Banking theme colors - more bluish focused
        banking: {
          primary: '#1a1a2e',
          secondary: '#16213e',
          accent: '#0ea5e9',
          lightBlue: '#1d4ed8', // Made darker from #3b82f6
          skyBlue: '#0c4a6e', // Made darker from #0284c7
          deepBlue: '#1e3a8a', // Made darker from #1d4ed8
          emerald: '#059669',
          slate: '#475569',
          dark: '#0f172a',
          darker: '#020617',
          navy: '#1e293b',
          blue: "#1e3a8a", // Deep royal blue
          gold: "#f59e0b", // Warm gold
          silver: "#94a3b8", // Cool silver
          white: "#f8fafc", // Pure white
          gray: "#64748b", // Balanced gray
          lightGray: "#e2e8f0", // Light gray
        }
      },
      backgroundImage: {
        // Enhanced modern patterns with blue tones
        'grid-pattern': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230ea5e9' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        'grid-pattern-dense': "url(\"data:image/svg+xml,%3csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='%233b82f6' fill-opacity='0.08'%3e%3cpath d='m30 30h-30v-30h30v30zm-1-1v-28h-28v28h28z'/%3e%3c/g%3e%3c/svg%3e\")",
        'dot-pattern': `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%231d4ed8' fill-opacity='0.08'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
        'hexagon-pattern': `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230c4a6e' fill-opacity='0.06'%3E%3Cpath d='M20 20l6.18-11.18C26.18 8.82 20 0 20 0s-6.18 8.82-6.18 8.82L20 20zm0 0l11.18-6.18C31.18 13.82 40 20 40 20s-8.82 6.18-8.82 6.18L20 20z'/%3E%3C/g%3E%3C/svg%3E")`,
        // Modern blue gradients
        'banking-gradient': 'linear-gradient(135deg, #0a0a0f 0%, #0f1419 25%, #1e293b 50%, #334155 75%, #475569 100%)',
        'hero-gradient': 'linear-gradient(135deg, #0a0a0f 0%, #0f1419 15%, #1e293b 30%, #334155 50%, #475569 70%, #64748b 85%, #94a3b8 100%)',
        'features-gradient': 'linear-gradient(135deg, #020617 0%, #0f172a 30%, #1e293b 70%, #334155 100%)',
        'modern-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        'vibrant-gradient': 'linear-gradient(135deg, #0ea5e9 0%, #1d4ed8 50%, #0c4a6e 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
      },
      fontFamily: {
        'banking': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'slide-left': 'slide-left 0.5s ease-out',
        'slide-right': 'slide-right 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'fade-in-down': 'fade-in-down 0.6s ease-out',
        'scale-in': 'scale-in 0.5s ease-out',
        'rotate-in': 'rotate-in 0.6s ease-out',
        'bounce-in': 'bounce-in 0.6s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'pulse-slow': 'pulse 4s infinite',
        'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'typing': 'typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite',
        'wave': 'wave 2s ease-in-out infinite',
        'zoom-in': 'zoom-in 0.5s ease-out',
        'flip': 'flip 0.6s ease-in-out',
        'swing': 'swing 1s ease-in-out infinite',
        'rubber-band': 'rubber-band 1s ease-out',
        'jello': 'jello 1s ease-out',
        'tada': 'tada 1s ease-out',
        'flash': 'flash 1s ease-out',
        'roll-in': 'roll-in 0.6s ease-out',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-right': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'rotate-in': {
          '0%': { transform: 'rotate(-180deg)', opacity: '0' },
          '100%': { transform: 'rotate(0)', opacity: '1' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
          '70%': { transform: 'scale(0.9)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
        'heartbeat': {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.3)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.3)' },
          '70%': { transform: 'scale(1)' },
        },
        'glow': {
          '0%': { 'box-shadow': '0 0 5px #0ea5e9, 0 0 10px #0ea5e9, 0 0 15px #0ea5e9' },
          '100%': { 'box-shadow': '0 0 10px #1d4ed8, 0 0 20px #1d4ed8, 0 0 30px #1d4ed8' },
        },
        'typing': {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        'blink-caret': {
          '0%, 50%': { 'border-color': 'transparent' },
          '51%, 100%': { 'border-color': '#0ea5e9' },
        },
        'wave': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(20deg)' },
          '75%': { transform: 'rotate(-15deg)' },
        },
        'zoom-in': {
          '0%': { transform: 'scale(0) rotate(180deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'flip': {
          '0%': { transform: 'perspective(400px) rotateY(0)' },
          '40%': { transform: 'perspective(400px) translateZ(150px) rotateY(170deg)' },
          '50%': { transform: 'perspective(400px) translateZ(150px) rotateY(190deg) scale(1)' },
          '80%': { transform: 'perspective(400px) rotateY(360deg) scale(0.95)' },
          '100%': { transform: 'perspective(400px) scale(1)' },
        },
        'swing': {
          '20%': { transform: 'rotate(15deg)' },
          '40%': { transform: 'rotate(-10deg)' },
          '60%': { transform: 'rotate(5deg)' },
          '80%': { transform: 'rotate(-5deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'rubber-band': {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scaleX(1.25) scaleY(0.75)' },
          '40%': { transform: 'scaleX(0.75) scaleY(1.25)' },
          '60%': { transform: 'scaleX(1.15) scaleY(0.85)' },
          '100%': { transform: 'scale(1)' },
        },
        'jello': {
          '0%, 11.1%, 100%': { transform: 'none' },
          '22.2%': { transform: 'skewX(-12.5deg) skewY(-12.5deg)' },
          '33.3%': { transform: 'skewX(6.25deg) skewY(6.25deg)' },
          '44.4%': { transform: 'skewX(-3.125deg) skewY(-3.125deg)' },
          '55.5%': { transform: 'skewX(1.5625deg) skewY(1.5625deg)' },
          '66.6%': { transform: 'skewX(-0.78125deg) skewY(-0.78125deg)' },
          '77.7%': { transform: 'skewX(0.390625deg) skewY(0.390625deg)' },
          '88.8%': { transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)' },
        },
        'tada': {
          '0%': { transform: 'scale(1)' },
          '10%, 20%': { transform: 'scale(0.9) rotate(-3deg)' },
          '30%, 50%, 70%, 90%': { transform: 'scale(1.1) rotate(3deg)' },
          '40%, 60%, 80%': { transform: 'scale(1.1) rotate(-3deg)' },
          '100%': { transform: 'scale(1) rotate(0)' },
        },
        'flash': {
          '0%, 50%, 100%': { opacity: '1' },
          '25%, 75%': { opacity: '0' },
        },
        'roll-in': {
          '0%': { opacity: '0', transform: 'translateX(-100%) rotate(-120deg)' },
          '100%': { opacity: '1', transform: 'translateX(0) rotate(0deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(14, 165, 233, 0.3)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-sky': '0 0 20px rgba(2, 132, 199, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(14, 165, 233, 0.1)',
      },
    },
  },
  plugins: [],
};
