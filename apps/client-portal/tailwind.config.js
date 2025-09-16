module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
    "../../packages/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors (customizable)
        primary: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316', // Main brand color
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        
        // Neutral colors based on Taskhub design
        neutral: {
          0: '#FFFFFF',
          50: '#FAFAFA',  // Background
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
        },

        // Status colors
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#FACC15',
          600: '#D97706',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
        },
        info: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
        },

        // Project color variations (like in Taskhub)
        projects: {
          yellow: '#FACC15',
          green: '#22C55E',
          blue: '#3B82F6',
          purple: '#A855F7',
          pink: '#EC4899',
          orange: '#F97316',
        },

        // Legacy brand colors for backward compatibility
        brand: {
          primary: '#F97316',
          secondary: '#FB923C',
          foreground: '#18181B',
          'text-light': '#71717A',
          'text-muted': '#A1A1AA',
          card: '#FFFFFF',
          border: '#E4E4E7',
          hover: '#F4F4F5',
          success: '#22C55E',
          warning: '#FACC15',
          error: '#EF4444',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        primary: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['13px', { lineHeight: '18px' }],
        'base': ['14px', { lineHeight: '20px' }],
        'lg': ['16px', { lineHeight: '24px' }],
        'xl': ['18px', { lineHeight: '28px' }],
        '2xl': ['20px', { lineHeight: '28px' }],
        '3xl': ['24px', { lineHeight: '32px' }],
        '4xl': ['28px', { lineHeight: '36px' }],
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'modal': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '120': '30rem',
      }
    }
  },
  plugins: []
}
