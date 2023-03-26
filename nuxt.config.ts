// https://nuxt.com/docs/api/configuration/nuxt-config
import {
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/supabase',
    '@unocss/nuxt',
    '@nuxtjs/web-vitals',
    '@pinia/nuxt',
    '@nuxtjs/robots',
    '@nuxtjs/html-validator',
    'nuxt-typed-router',
  ],
  plugins: [{ src: '~/plugins/vercel.ts', mode: 'client' }],
  app: {
    head: {
      title: 'MRT Notes',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'MRT Notes allows you to generate ert note snippets',
        },
      ],
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        {
          rel: 'stylesheet',
          href: 'https://wow.zamimg.com/css/universal.css',
        },
      ],
    },
  },
  imports: {
    dirs: ['services', 'store'],
  },
  css: ['~/assets/styles/main.scss'],
  srcDir: 'src/',
  unocss: {
    presets: [
      presetWind({
        dark: 'class',
      }),
      presetIcons(),
      presetTypography(),
      presetWebFonts({
        provider: 'google',
        fonts: {
          sans: ['Montserrat:400,700', 'Source Sans Pro'],
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
  },
  pinia: {
    autoImports: ['defineStore', ['defineStore', 'definePiniaStore']],
  },
  webVitals: {
    provider: 'vercel',
  },
  nitro: {
    // Development
    devStorage: {
      db: {
        driver: 'fs',
        base: './data/db',
      },
    },
  },
  htmlValidator: {
    usePrettier: true,
  },
})
