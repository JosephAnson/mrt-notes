<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()

const email = ref('')
</script>

<template>
  <Section>
    <Container>
      <Heading h1>
        Login
      </Heading>
      <div class="mb-8">
        <Field label-for="email" label="Email" stacked>
          <BaseInput id="email" v-model="email" type="email" />
        </Field>
        <BaseButton @click="signInWithOtp(email)">
          Sign In
        </BaseButton>
      </div>

      <div v-if="!user" class="flex flex-wrap">
        <BaseButton
          class="flex items-center !bg-[#5865f2] !hover:bg-[#7983f5] mb-2 mr-2"
          @click="login('discord')"
        >
          <span class="i-carbon-logo-discord inline-block mr-2 text-xl" />
          Login with Discord
        </BaseButton>
        <BaseButton
          class="flex items-center !bg-[#db4437] !hover:bg-[#D52E29] mb-2 mr-2"
          @click="login('google')"
        >
          <span class="i-carbon-logo-google inline-block mr-2 text-xl" />
          Login with Google
        </BaseButton>
      </div>
      <BaseButton v-else @click="client.auth.signOut()">
        Logout
      </BaseButton>
    </Container>
  </Section>
</template>
