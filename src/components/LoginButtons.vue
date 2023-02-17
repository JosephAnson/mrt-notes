<script setup lang="ts">
const client = useSupabaseAuthClient()
const user = useSupabaseUser()
</script>

<template>
  <nuxt-link v-if="!user" to="login">
    <Button>
      Login
    </Button>
  </nuxt-link>
  <Button
    v-else
    @click="client.auth.signOut()"
  >
    Logout
  </Button>
</template>
