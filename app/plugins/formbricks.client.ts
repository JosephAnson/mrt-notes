import formbricks from '@formbricks/js/website'

export default defineNuxtPlugin({
  name: 'formbricks',
  parallel: true,
  async setup() {
    const router = useRouter()

    await formbricks.init({
      environmentId: 'cm0nibpw7000624a2x6p6ov3a',
      apiHost: 'https://forms.josephanson.com',
    })

    watch(() => router.currentRoute.value.fullPath, async () => {
      await formbricks.registerRouteChange()
    })

    return {
      provide: {
        formbricks,
      },
    }
  },
})
