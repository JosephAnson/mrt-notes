<script setup lang="ts">
const client = useSupabaseAuthClient()
const user = useSupabaseUser()
const route = useRouter()

const email = ref('')
const returnUrl = computed(() => (route.currentRoute.value.query as { returnUrl?: string })?.returnUrl)
</script>

<template>
  <Section>
    <Container>
      <Heading h1>Login</Heading>
      <div class="mb-8">
        <Field label-for="email" label="Email" stacked>
          <Input id="email" v-model="email" type="email" />
        </Field>
        <Button @click="signInWithOtp(email, returnUrl)"> Sign In </Button>
      </div>

      <Button
        v-if="!user"
        class="flex items-center !bg-[#5865f2] !hover:bg-[#7983f5]"
        @click="login('discord', returnUrl)"
      >
        <span class="i-carbon-logo-discord inline-block mr-2 text-xl" />
        Login with Discord
      </Button>
      <Button v-else @click="client.auth.signOut()"> Logout </Button>
    </Container>
  </Section>
</template>
