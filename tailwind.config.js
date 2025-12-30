/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          900: '#00627A',
          800: '#007C99',
          700: '#0096B8',
          600: '#006885',
          500: '#2F87A0',
          400: '#5ACFEA',
          300: '#89DFF1',
          200: '#B8EEF7',
          100: '#E6FAFC',
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
          900: '#0040C4',
          800: '#0054F0',
          700: '#3069FF',
          600: '#4D80FF',
          500: '#6694FF',
          400: '#85A9FF',
          300: '#A8BFFF',
          200: '#CCDAFF',
          100: '#E6EEFF',
          50: '#F4F7FF',
        },
        green: {
          900: '#005840',
          800: '#00724F',
          700: '#008D5F',
          600: '#00A86F',
          500: '#33C185',
          400: '#66D9A2',
          300: '#99E4BC',
          200: '#CCF0D8',
          100: '#E6F8EC',
          50: '#F4FCF7',
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
          600: '#80E2F0',
          500: '#B3F1F7',
        },
        gray: {
          900: '#1E232B',
          800: '#202939',
          700: '#3F4752',
          600: '#505A66',
          500: '#697586',
          400: '#9AA4B2',
          300: '#C6CDD6',
          200: '#EAEDF2',
          100: '#EFF2F5',
          50: '#F6F8F9',
          white: '#FFFFFF',
        },
        yellow: {
          500: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["Be Vietnam Pro", "system-ui", "sans-serif"],
      },
      fontSize: {
        tiny: ".6rem",
        mini: ".625rem",
        base: ".875rem",
        normal: "1rem",
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
