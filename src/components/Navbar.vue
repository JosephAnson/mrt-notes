<script lang="ts" setup>
const client = useSupabaseAuthClient()
const user = useSupabaseUser()
const profile = await useAsyncGetProfile()
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

          <nuxt-link v-if="!user" to="login">
            <Button> Login </Button>
          </nuxt-link>
          <template v-else>
            <nuxt-link to="account">
              <Button> Account ({{ profile.username }}) </Button>
            </nuxt-link>
            <Button @click="client.auth.signOut()"> Logout </Button>
          </template>
        </div>
      </div>
    </Container>
  </nav>
</template>
