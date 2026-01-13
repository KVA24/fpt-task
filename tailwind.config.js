/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          900: '#FE592A',
          800: '#440607',
          700: '#FD3C12',
          600: '#FE592A',
          500: '#2F87A0',
          400: '#5ACFEA',
          300: '#89DFF1',
          200: '#B8EEF7',
          100: '#FFE3D4',
          50: '#F2FDFE',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          900: '#B68400',
          800: '#C89100',
          700: '#DA9E00',
          600: '#EBAC00',
          500: '#F2C13D',
          400: '#F6D072',
          300: '#FADE9E',
          200: '#FDEACC',
          100: '#FEF3E2',
          50: '#FFF8F0',
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gradient: {
          start: "#0ea5e9",
          end: "#0284c7",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        blue: {
          900: '#0040C1',
          800: '#004EEB',
          700: '#155EEF',
          600: '#2970FF',
          500: '#528BFF',
          400: '#84ADFF',
          300: '#B2CCFF',
          200: '#D1E0FF',
          100: '#EFF4FF',
          50: '#F5F8FF',
        },
        green: {
          900: '#085D3A',
          800: '#067647',
          700: '#079455',
          600: '#17B26A',
          500: '#47CD89',
          400: '#75E0A7',
          300: '#ABEFC6',
          200: '#DCFAE6',
          100: '#ECFDF3',
          50: '#F6FEF9',
        },
        orange: {
          900: '#8C1D10',
          800: '#A61E12',
          700: '#C02A1A',
          600: '#DA3A26',
          500: '#F06759',
          400: '#F48A7D',
          300: '#F7ACA2',
          200: '#FAD0C7',
          100: '#FDE8E2',
          50: '#FEF3F0',
        },
        purple: {
          900: '#8757FF',
          800: '#A178FF',
          700: '#C29AFF',
          600: '#DCC1FF',
          500: '#EDE0FF',
        },
        cyan: {
          900: '#00A6C4',
          800: '#26BFE0',
          700: '#4CD1E9',
          600: '#06AED4',
          500: '#67E3F9',
          400: '#A5F0FC',
          300: '#CFF9FE'
        },
        gray: {
          900: '#1E232B',
          800: '#202939',
          700: '#364152',
          600: '#4B5565',
          500: '#697586',
          400: '#9AA4B2',
          300: '#CDD5DF',
          200: '#EAEDF2',
          100: '#F4F6F9',
          50: '#F8FAFC',
          25: '#FCFCFD',
          white: '#FFFFFF',
        },
        yellow: {
          500: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["Be Vietnam Pro", "system-ui", "sans-serif"],
        rankNumber: ["Rank Number Font", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Heading
        h1: ['40px', { lineHeight: '46px' }],
        h2: ['32px', { lineHeight: '38px' }],
        h3: ['24px', { lineHeight: '30px' }],
        h4: ['20px', { lineHeight: '26px' }],
        h5: ['18px', { lineHeight: '24px' }],
        
        // Body
        body1: ['16px', { lineHeight: '22px' }],
        body2: ['14px', { lineHeight: '20px' }],
        body3: ['12px', { lineHeight: '16px' }],
        body4: ['10px', { lineHeight: '14px' }],
        
        // Giữ lại nếu đang dùng
        tiny: '.6rem',
        mini: '.625rem',
        base: '.875rem',
        normal: '1rem',
      },
      maxWidth: {
        sm: "428px",
      },
      animation: {
        spin: "spin 1s linear infinite",
      },
      borderRadius: {
        lg: "16px",
        md: "8px",
        sm: "4px",
      },
      boxShadow: {
        'inner-sm': 'inset 0 1px 2px rgba(0,0,0,0.15)',
        'inner-md': 'inset 0 3px 6px rgba(0,0,0,0.25)',
        'inner-lg': 'inset 0 6px 12px rgba(0,0,0,0.35)',
      }
    },
  },
  plugins: [
    function ({addUtilities}) {
      addUtilities({
        '.no-scrollbar': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari và Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
}
