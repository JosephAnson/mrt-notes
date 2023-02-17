// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts',
    '@nuxtjs/supabase',
  ],
  googleFonts: {
    families: {
      Montserrat: true,
    },
  },
  app: {
    head: {
      htmlAttrs: {
        class: 'has-navbar-fixed-top',
      },
      title: 'ERT Notes',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'ERT Notes allows you to generate ert note snippets',
        },
      ],
    },
  },
  css: [
    '~/assets/styles/main.scss',
  ],
  srcDir: 'src/',
})
