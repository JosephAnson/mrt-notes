import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetWind({
      dark: 'class',
    }),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: ['Montserrat:400,700', 'Source Sans Pro:400,700'],
      },
    }),
  ],
  shortcuts: [['overlay', 'absolute top-0 left-0 w-full h-full ']],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
      },
    },
    colors: {
      primary: {
        DEFAULT: '#020816',
        100: '#0f399c',
        200: '#0d338b',
        300: '#0c2d7b',
        400: '#0a276a',
        500: '#09215a',
        600: '#071b49',
        700: '#051539',
        800: '#040f28',
        900: '#020816',
      },
    },
  },
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: 'text-l text-xl text-2xl'.split(' '),
})
