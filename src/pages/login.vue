<script setup lang="ts">
import { login, signInWithOtp } from '~/services/user'

const client = useSupabaseAuthClient()
const user = useSupabaseUser()

const email = ref('')
</script>

<template>
  <Page>
    <Container>
      <div class="mb-8">
        <Field label-for="email" label="Email" stacked>
          <Input id="email" v-model="email" type="email" />
        </Field>
        <Button @click="signInWithOtp(email)"> Sign In </Button>
      </div>

      <Button v-if="!user" @click="login('discord')">
        Login with Discord
      </Button>
      <Button v-else @click="client.auth.signOut()"> Logout </Button>
    </Container>
  </Page>
</template>
