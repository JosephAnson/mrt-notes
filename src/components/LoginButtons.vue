<script setup lang="ts">
import { login } from '~/services/user'

const client = useSupabaseAuthClient()
const user = useSupabaseUser()
</script>

<template>
  <Button v-if="!user" @click="login('discord')">
    Login with Discord
  </Button>
  <Button
    v-else
    @click="client.auth.signOut()"
  >
    Logout
  </Button>
</template>
