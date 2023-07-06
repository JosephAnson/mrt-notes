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
  devtools: true,
  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/supabase',
    '@unocss/nuxt',
    // '@nuxtjs/web-vitals',
    '@pinia/nuxt',
    '@nuxtjs/html-validator',
    [
      '@nuxtjs/google-adsense',
      {
        id: process.env.GOOGLE_ADSENSE_ID,
      },
    ],
  ],
  plugins: [{ src: '~/plugins/vercel.ts', mode: 'client' }],
  extends: ['nuxt-seo-kit'],
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://mrt-notes.vercel.app/',
      siteName: 'MRT Notes: Your Ultimate Raid Planning Companion',
      siteDescription:
        "MRT Notes is the ultimate website dedicated to making raid leaders' lives easier with efficient MRT note planning. Create, share, and export comprehensive raid notes effortlessly. Streamline your raid organization process with boss spell automation, customizable note grouping, and advanced editor tools. Join MRT Notes and revolutionize your raid planning experience.",
      language: 'en',
    },
  },
  app: {
    head: {
      title: 'MRT Notes',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'MRT Notes: Your Ultimate Raid Planning Companion',
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
        {
          rel: 'stylesheet',
          href: '',
        },
      ],
      script: [
        {
          async: true,
          crossorigin: 'anonymous',
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7716403137825737',
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
  },
  pinia: {
    autoImports: ['defineStore', ['defineStore', 'definePiniaStore']],
  },
  webVitals: {
    provider: 'vercel',
  },
  nitro: {
    storage: {
      cache: { driver: 'vercelKV' },
      data: { driver: 'vercelKV' },
    },
  },
  htmlValidator: {
    usePrettier: true,
  },
  experimental: {
    typedPages: true,
  },
})
