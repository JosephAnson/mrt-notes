<script setup lang="ts">
import Notification from '~/components/Notification.vue'

definePageMeta({
  middleware: 'auth',
})

const user = useSupabaseUser()
const profile = useProfile()

await useAsyncGetProfile()

const username = ref<string>(profile.value?.username || '')
</script>

<template>
  <Section>
    <Container>
      <Heading h1>Account</Heading>

      <div class="max-w-lg">
        <Field v-if="profile.avatar_url" label-for="avatar" stacked>
          <img class="w-48 rounded-full" :src="profile.avatar_url" />
        </Field>

        <Field v-if="profile.username" stacked>
          <NuxtLink :to="`profile/${profile.username}`">
            <Button>View Profile</Button>
          </NuxtLink>
        </Field>

        <Field v-if="user?.email" label-for="avatar_url" label="Email" stacked>
          <Input id="avatar_url" v-model="user.email" type="text" disabled />
        </Field>
        <Field label-for="username" label="Username" stacked>
          <div class="flex">
            <Input id="username" v-model="username" type="text" class="mr-2" />
            <Button
              :disabled="username === profile.username || !username"
              @click="username !== profile.username && updateUsername(username)"
            >
              Set Username
            </Button>
          </div>
        </Field>
        <Notification v-if="!profile.username"> Set a username if you want to share your profile </Notification>
        <Field v-if="user" label-for="signup with" label="Signed up with " stacked>
          <span v-for="provider in user.app_metadata.providers" :key="provider" class="bg-primary-100 p-1 px-2 rounded">
            {{ provider.toUpperCase() }}
          </span>
        </Field>
      </div>
    </Container>
  </Section>
</template>
