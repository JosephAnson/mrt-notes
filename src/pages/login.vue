<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()
const route = useRouter()

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
          <Input id="email" v-model="email" type="email" />
        </Field>
        <Button @click="signInWithOtp(email)">
          Sign In
        </Button>
      </div>

      <div v-if="!user" class="flex flex-wrap">
        <Button
          class="flex items-center !bg-[#5865f2] !hover:bg-[#7983f5] mb-2 mr-2"
          @click="login('discord')"
        >
          <span class="i-carbon-logo-discord inline-block mr-2 text-xl" />
          Login with Discord
        </Button>
        <Button
          class="flex items-center !bg-[#db4437] !hover:bg-[#D52E29] mb-2 mr-2"
          @click="login('google')"
        >
          <span class="i-carbon-logo-google inline-block mr-2 text-xl" />
          Login with Google
        </Button>
      </div>
      <Button v-else @click="client.auth.signOut()">
        Logout
      </Button>
    </Container>
  </Section>
</template>
