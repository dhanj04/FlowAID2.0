/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: 'class', // Enable dark mode with class strategy
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#3B82F6', // Blue - main brand color
            50: '#EFF6FF',
            100: '#DBEAFE',
            200: '#BFDBFE',
            300: '#93C5FD',
            400: '#60A5FA',
            500: '#3B82F6',
            600: '#2563EB',
            700: '#1D4ED8',
            800: '#1E40AF',
            900: '#1E3A8A',
            950: '#172554',
          },
          secondary: {
            DEFAULT: '#38BDF8', // Light blue - secondary brand color
            50: '#F0F9FF',
            100: '#E0F2FE',
            200: '#BAE6FD',
            300: '#7DD3FC',
            400: '#38BDF8',
            500: '#0EA5E9',
            600: '#0284C7',
            700: '#0369A1',
            800: '#075985',
            900: '#0C4A6E',
            950: '#082F49',
          },
          accent: {
            DEFAULT: '#14B8A6', // Teal - accent color for highlights
            50: '#F0FDFA',
            100: '#CCFBF1',
            200: '#99F6E4',
            300: '#5EEAD4',
            400: '#2DD4BF',
            500: '#14B8A6',
            600: '#0D9488',
            700: '#0F766E',
            800: '#115E59',
            900: '#134E4A',
            950: '#042F2E',
          },
          success: {
            DEFAULT: '#22C55E', // Green for success states
            50: '#F0FDF4',
            100: '#DCFCE7',
            200: '#BBF7D0',
            300: '#86EFAC',
            400: '#4ADE80',
            500: '#22C55E',
            600: '#16A34A',
            700: '#15803D',
            800: '#166534',
            900: '#14532D',
            950: '#052E16',
          },
          warning: {
            DEFAULT: '#FBBF24', // Amber for warning states
            50: '#FFFBEB',
            100: '#FEF3C7',
            200: '#FDE68A',
            300: '#FCD34D',
            400: '#FBBF24',
            500: '#F59E0B',
            600: '#D97706',
            700: '#B45309',
            800: '#92400E',
            900: '#78350F',
            950: '#451A03',
          },
          danger: {
            DEFAULT: '#EF4444', // Red for error states
            50: '#FEF2F2',
            100: '#FEE2E2',
            200: '#FECACA',
            300: '#FCA5A5',
            400: '#F87171',
            500: '#EF4444',
            600: '#DC2626',
            700: '#B91C1C',
            800: '#991B1B',
            900: '#7F1D1D',
            950: '#450A0A',
          },
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
            950: '#030712',
          },
          dark: {
            DEFAULT: '#1F2937',
            light: '#374151',
            lighter: '#4B5563',
          },
          light: {
            DEFAULT: '#F9FAFB',
            dark: '#F3F4F6',
            darker: '#E5E7EB',
          }
        },
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
          display: ['Inter', 'ui-sans-serif', 'system-ui'],
          mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        },
        animation: {
          'fade-in': 'fade-in 1s ease-out forwards',
          'slide-up': 'slide-up 0.7s ease-out forwards',
          'slide-down': 'slide-down 0.7s ease-out forwards',
          'slide-left': 'slide-left 0.7s ease-out forwards',
          'slide-right': 'slide-right 0.7s ease-out forwards',
          'scale-up': 'scale-up 0.7s ease-out forwards',
          'pulse-slow': 'pulse 3s ease-in-out infinite',
          'bounce-slow': 'bounce 3s ease-in-out infinite',
          'spin-slow': 'spin-slow 15s linear infinite',
        },
        keyframes: {
          'fade-in': {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          'slide-up': {
            '0%': { transform: 'translateY(30px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          'slide-down': {
            '0%': { transform: 'translateY(-30px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          'slide-left': {
            '0%': { transform: 'translateX(30px)', opacity: '0' },
            '100%': { transform: 'translateX(0)', opacity: '1' },
          },
          'slide-right': {
            '0%': { transform: 'translateX(-30px)', opacity: '0' },
            '100%': { transform: 'translateX(0)', opacity: '1' },
          },
          'scale-up': {
            '0%': { transform: 'scale(0.8)', opacity: '0' },
            '100%': { transform: 'scale(1)', opacity: '1' },
          },
          'spin-slow': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        },
        boxShadow: {
          'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
          'strong': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
          'healthcare-gradient': 'linear-gradient(135deg, #3B82F6 0%, #38BDF8 50%, #14B8A6 100%)',
        },
        transitionDuration: {
          '2000': '2000ms',
          '3000': '3000ms',
        },
        backdropBlur: {
          xs: '2px',
        },
        typography: (theme) => ({
          DEFAULT: {
            css: {
              color: theme('colors.gray.700'),
              maxWidth: '65ch',
              h1: {
                color: theme('colors.gray.900'),
                fontWeight: '800',
              },
              h2: {
                color: theme('colors.gray.900'),
                fontWeight: '700',
              },
              h3: {
                color: theme('colors.gray.900'),
                fontWeight: '600',
              },
              a: {
                color: theme('colors.primary.500'),
                '&:hover': {
                  color: theme('colors.primary.600'),
                },
              },
              strong: {
                color: theme('colors.gray.900'),
              },
            },
          },
          dark: {
            css: {
              color: theme('colors.gray.300'),
              h1: {
                color: theme('colors.gray.100'),
              },
              h2: {
                color: theme('colors.gray.100'),
              },
              h3: {
                color: theme('colors.gray.100'),
              },
              strong: {
                color: theme('colors.gray.100'),
              },
              a: {
                color: theme('colors.primary.400'),
                '&:hover': {
                  color: theme('colors.primary.300'),
                },
              },
            },
          },
        }),
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
      require('@tailwindcss/forms'),
      require('@tailwindcss/aspect-ratio'),
    ],
  }