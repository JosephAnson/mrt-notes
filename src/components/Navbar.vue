<script lang="ts" setup>
const client = useSupabaseAuthClient()
const user = useSupabaseUser()
const router = useRouter()
const profile = useProfile()

const { data: asyncProfile } = await useAsyncData(
  'profile',
  async () => await getProfile()
)

if (asyncProfile.value)
  setProfile({
    id: asyncProfile.value.id,
    username: asyncProfile.value.username,
    avatar_url: asyncProfile.value.avatar_url,
  })

// Watch to see if user changes to re-fetch notes
watchOnce(
  () => user.value,
  async () => {
    const profile = await getProfile()

    if (profile)
      setProfile({
        id: profile.id,
        username: profile.username,
        avatar_url: profile.avatar_url,
      })
  },
  { deep: true }
)

function login() {
  router.push(`/login?returnUrl=${window.location.href}`)
}

function logout() {
  client.auth.signOut()
  router.push('/')
}
</script>

<template>
  <nav class="relative bg-primary-100">
    <Container>
      <div class="flex items-center justify-between py-2">
        <nuxt-link
          to="/"
          title="ERT: ERT Note creator for WoW"
          class="heading font-secondary font-semibold flex justify-start text-l mr-2"
        >
          MRT Notes
        </nuxt-link>

        <div class="menu flex">
          <Button class="mr-2" @click="tweet"> Tweet </Button>

          <nuxt-link to="/playground">
            <Button class="mr-2"> Playground </Button>
          </nuxt-link>

          <Button v-if="!user" @click="login"> Login </Button>

          <template v-else>
            <nuxt-link to="/account">
              <Button> Account ({{ profile.username }}) </Button>
            </nuxt-link>
            <Button @click="logout"> Logout </Button>
          </template>
        </div>
      </div>
    </Container>
  </nav>
</template>
