<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const profile = await useAsyncGetProfile()
const user = useSupabaseUser()

const username = ref(profile.value.username)

// client.auth.updateUser()
</script>

<template>
  <Page>
    <Container>
      <Field label-for="avatar" label="Avatar" stacked>
        <img :src="profile.avatar_url" />
      </Field>

      <Field label-for="avatar_url" label="Email" stacked>
        <Input id="avatar_url" v-model="user.email" type="text" disabled />
      </Field>
      <Field label-for="username" label="Username" stacked>
        <div class="flex">
          <Input id="username" v-model="username" type="text" class="mr-2" />
          <Button
            :disabled="username === profile.username"
            @click="username !== profile.username && updateUsername(username)"
          >
            Set Username
          </Button>
        </div>
      </Field>
      <Field label-for="signup with" label="Signed up with " stacked>
        <span
          v-for="provider in user.app_metadata.providers"
          :key="provider"
          class="bg-primary-100 p-1 px-2 rounded"
        >
          {{ provider }}
        </span>
      </Field>
    </Container>
  </Page>
</template>
