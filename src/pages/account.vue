<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const profile = await useAsyncGetProfile()
const user = useSupabaseUser()

const username = ref(profile.value.username)
</script>

<template>
  <Page>
    <Container>
      <div class="max-w-lg">
        <Field
          v-if="profile.avatar_url"
          label-for="avatar"
          label="Avatar"
          stacked
        >
          <img class="w-48 rounded-full" :src="profile.avatar_url" />
        </Field>

        <Field v-if="user?.email" label-for="avatar_url" label="Email" stacked>
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
      </div>
    </Container>
  </Page>
</template>
