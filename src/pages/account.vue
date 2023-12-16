<script setup lang="ts">
import Notification from '~/components/Notification.vue'

definePageMeta({
  middleware: 'auth',
})

const user = useSupabaseUser()
const profileStore = useProfileStore()

await useAsyncData('profile', async () => await profileStore.fetchProfile())

const username = ref<string>(profileStore.username || '')
</script>

<template>
  <Section>
    <Container>
      <Heading h1>
        Account
      </Heading>

      <div class="md:grid grid-cols-12 gap-8">
        <div class="col-span-12 xl:col-span-6">
          <div class="max-w-lg">
            <Field v-if="profileStore.profile.avatar_url" label-for="avatar" stacked>
              <img class="w-48 rounded-full" :src="profileStore.profile.avatar_url">
            </Field>

            <Field v-if="profileStore.profile.username" stacked>
              <Button :to="`/profile/${profileStore.profile.username}`">
                View Profile
              </Button>
            </Field>
            <Field v-if="user?.email" label-for="avatar_url" label="Email" stacked>
              <Input id="avatar_url" v-model="user.email" type="text" disabled />
            </Field>
            <Field label-for="username" label="Username" stacked>
              <div class="flex">
                <Input id="username" v-model="username" type="text" class="mr-2" />
                <Button
                  :disabled="username === profileStore.profile.username || !username"
                  @click="username !== profileStore.profile.username && profileStore.setUsername(username)"
                >
                  Set Username
                </Button>
              </div>
            </Field>
            <Notification v-if="!profileStore.profile.username">
              Set a username if you want to share your profile
            </Notification>
            <Field v-if="user" label-for="signup with" label="Signed up with " stacked>
              <span
                v-for="provider in user.app_metadata.providers"
                :key="provider"
                class="bg-primary-100 p-1 px-2 rounded"
              >
                {{ provider.toUpperCase() }}
              </span>
            </Field>
          </div>
        </div>
      </div>
    </Container>
  </Section>
</template>
