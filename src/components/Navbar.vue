<script lang="ts" setup>
const client = useSupabaseAuthClient()
const user = useSupabaseUser()
const router = useRouter()
const profile = useProfile()

const { data: asyncProfile } = await useAsyncData(
  'nav-profile',
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
        <NuxtLink
          to="/"
          title="ERT: ERT Note creator for WoW"
          class="heading font-secondary font-semibold flex justify-start text-l mr-2"
        >
          MRT Notes
        </NuxtLink>

        <div class="menu flex">
          <NuxtLink to="/search">
            <Button class="mr-2"> Search </Button>
          </NuxtLink>

          <NuxtLink to="/playground">
            <Button class="mr-2"> Playground </Button>
          </NuxtLink>

          <Button v-if="!user" @click="login"> Login </Button>

          <template v-else>
            <NuxtLink
              v-if="profile.username"
              :to="`/profile/${profile.username}`"
            >
              <Button> My Notes </Button>
            </NuxtLink>
            <NuxtLink to="/team/">
              <Button> Team </Button>
            </NuxtLink>
            <NuxtLink to="/account">
              <Button v-if="profile.username">
                Account ({{ profile.username }})
              </Button>
              <Button v-else> Account </Button>
            </NuxtLink>
            <Button @click="logout"> Logout </Button>
          </template>
        </div>
      </div>
    </Container>
  </nav>
</template>
