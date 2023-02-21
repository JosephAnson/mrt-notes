<script setup lang="ts">
const client = useSupabaseAuthClient()
const user = useSupabaseUser()
const route = useRouter()

const email = ref('')
const returnUrl = computed(
  () => (route.currentRoute.value.query as { returnUrl?: string })?.returnUrl
)
</script>

<template>
  <Page>
    <Container>
      <div class="mb-8">
        <Field label-for="email" label="Email" stacked>
          <Input id="email" v-model="email" type="email" />
        </Field>
        <Button @click="signInWithOtp(email, returnUrl)"> Sign In </Button>
      </div>

      <Button v-if="!user" @click="login('discord', returnUrl)">
        Login with Discord
      </Button>
      <Button v-else @click="client.auth.signOut()"> Logout </Button>
    </Container>
  </Page>
</template>
