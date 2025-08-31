module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
    "../../packages/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Warm gradient colors from reference
          primary: '#ffaa44',    // Warm orange
          secondary: '#ffcc66',  // Golden yellow
          tertiary: '#ff8844',   // Warm orange-red

          // Background gradients
          'bg-start': '#fff9f0',  // Warm cream
          'bg-end': '#fff4e6',    // Light peach

          // Text colors
          foreground: '#2d2d2d',  // Dark gray
          'text-light': '#666666', // Medium gray
          'text-muted': '#999999', // Light gray

          // UI colors
          card: '#ffffff',
          border: '#e8e8e8',
          hover: '#f8f8f8',

          // Status colors
          success: '#4ade80',
          warning: '#fbbf24',
          error: '#ef4444',
          info: '#3b82f6',
        }
      },
      fontFamily: {
        primary: ['Host Grotesk', 'system-ui', 'sans-serif'],
        heading: ['Host Grotesk', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #fff9f0 0%, #fff4e6 100%)',
        'gradient-card': 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
        'gradient-primary': 'linear-gradient(135deg, #ffaa44 0%, #ffcc66 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #ff8844 0%, #ffaa44 100%)',
        'gradient-warm': 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%)',
        'gradient-peach': 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
        'gradient-coral': 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
        'gradient-gold': 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
        'gradient-amber': 'linear-gradient(135deg, #fffbeb 0%, #fde68a 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 245, 235, 0.7) 100%)',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
      }
    }
  },
  plugins: []
}
