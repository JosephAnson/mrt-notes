<script lang="ts" setup>
const isMenuActive = ref(false)

function tweet(): void {
  const width = 575
  const height = 400
  const left = (window.screen.width - width) / 2
  const top = (window.screen.height - height) / 2
  const url = `https://twitter.com/share?url=${encodeURIComponent(
        `${document.location.protocol}//${document.location.host}`,
      )}&text=ERT Notes: Quick build ERT Notes to use in WoW&hashtags=ERTNotes&via=JosephLeeAnson`
  const opts = `status=1,width=${width},height=${height},top=${top},left=${left}`

  window.open(url, '', opts)
}

const client = useSupabaseAuthClient()
const user = useSupabaseUser()
const router = useRouter()

// Login method using providers
const login = async (provider: 'discord' | 'google') => {
  const { error } = await client.auth.signInWithOAuth({ provider })
  if (error)
    return alert('Something went wrong !')

  router.push('/dashboard')
}
</script>

<template>
  <nav class="navbar-main is-dark is-spaced navbar is-fixed-top">
    <div class="container">
      <div class="navbar-brand">
        <nuxt-link
          to="/"
          class="navbar-item"
          title="ERT: ERT Note creator for WoW"
        >
          ERT Notes
        </nuxt-link>

        <span
          class="navbar-burger burger"
          :class="{ 'is-active': isMenuActive }"
          @click="isMenuActive = !isMenuActive"
        >
          <span />
          <span />
          <span />
        </span>
      </div>

      <div
        class="navbar-menu is-shadowless"
        :class="{ 'is-active': isMenuActive }"
      >
        <div class="navbar-end">
          <div class="navbar-item">
            <Button v-if="!user" @click="login('discord')">
              Login with Discord
            </Button>

            <Button v-if="user" @click="client.auth.signOut()">
              Logout
            </Button>
          </div>

          <div class="navbar-item">
            <a class="button is-outlined is-fullwidth-mobile" @click="tweet">
              <span>Tweet</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
