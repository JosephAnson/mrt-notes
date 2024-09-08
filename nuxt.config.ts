// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2024-09-01',
  future: {
    compatibilityVersion: 4,
  },
  extends: [
    'nuxt-umami',
  ],
  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@nuxtjs/seo',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxt/fonts',
    'radix-vue/nuxt',
    '@nuxt/icon',
  ],
  appConfig: {
    umami: {
      host: 'https://unami.josephanson.com/',
      id: '15bee164-d93d-4458-8eab-f97bfb6132b2',
      version: 2,
    },
  },
  site: {
    siteUrl: 'https://mrt-notes.josephanson.app/',
    siteName: 'MRT Notes: Your Ultimate Raid Planning Companion',
    siteDescription:
      'MRT Notes is the ultimate website dedicated to making raid leaders\' lives easier with efficient MRT note planning. Create, share, and export comprehensive raid notes effortlessly. Streamline your raid organization process with boss spell automation, customizable note grouping, and advanced editor tools. Join MRT Notes and revolutionize your raid planning experience.',
    language: 'en',
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
      ],
      script: [
        {
          async: true,
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7716403137825737',
          crossorigin: 'anonymous',
        },
      ],
    },
  },
  imports: {
    dirs: ['services', 'store'],
  },
  css: ['~~/app/assets/styles/main.scss', '~~/app/assets/styles/tailwind.css'],
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['*'],
    },
  },
  nitro: {
    storage: {
      cache: {
        driver: 'redis',
        host: `${process.env.REDIS_HOST}`,
        port: 6379, // Redis port
        username: 'default', // needs Redis >= 6
        password: `${process.env.REDIS_PASSWORD}`,
        db: 1, // Defaults to 0
      },
      data: {
        driver: 'redis',
        host: `${process.env.REDIS_HOST}`,
        port: 6379, // Redis port
        username: 'default', // needs Redis >= 6
        password: `${process.env.REDIS_PASSWORD}`,
        db: 1, // Defaults to 0
      },
    },
    // Development
    // Useful to check if redis is working
    /*  devStorage: {
      cache: {
        driver: 'redis',
        host: `${process.env.REDIS_HOST}`,
        port: 6379, // Redis port
        username: 'default', // needs Redis >= 6
        password: `${process.env.REDIS_PASSWORD}`,
        db: 1, // Defaults to 0
      },
      data: {
        driver: 'redis',
        host: `${process.env.REDIS_HOST}`,
        port: 6379, // Redis port
        username: 'default', // needs Redis >= 6
        password: `${process.env.REDIS_PASSWORD}`,
        db: 1, // Defaults to 0
      },
    }, */
  },
  experimental: {
    typedPages: true,
  },
  components: {
    global: true,
    dirs: ['~/components'],
  },
  fonts: {
    families: [
      // only resolve this font with the `google` provider
      { name: 'Montserrat', provider: 'google', weights: [400, 500, 700] },
    ],
    defaults: {
      weights: [400],
      styles: ['normal', 'italic'],
      subsets: [
        'cyrillic-ext',
        'cyrillic',
        'greek-ext',
        'greek',
        'vietnamese',
        'latin-ext',
        'latin',
      ],
    },
  },
  icon: {
    serverBundle: {
      collections: ['carbon', 'ph', 'bi', 'devicon-plain'],
    },
  },
})
