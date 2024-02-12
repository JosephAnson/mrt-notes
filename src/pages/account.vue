<script setup lang="ts">
import Notification from '~/components/Notification.vue'
import { updateUsername, usernameExists } from '~/services/profile'

definePageMeta({
  middleware: 'auth',
})

const user = useSupabaseUser()

const { data: profile } = await useFetch(`/api/profile/${user.value?.id}`, {
  headers: useRequestHeaders(['cookie']),
  watch: [user],
})

const username = ref<string>(profile.value?.username || '')

async function setUsername() {
  if (!username.value) {
    openSnackbar({
      message: 'Username cannot be empty!',
      background: 'bg-red-700',
    })
  }
  else {
    const usernameExist = await usernameExists(username.value)

    if (usernameExist) {
      openSnackbar({
        message: 'Username exists try another!',
        background: 'bg-red-700',
      })
    }
    else {
      const user = useSupabaseUser()
      if (!user.value) throw new Error('User not logged in')

      const data = await updateUsername(username.value, user.value.id)

      if (data.username)
        username.value = data.username

      openSnackbar('Saved username')
    }
  }
}
</script>

<template>
  <Section>
    <Container v-if="profile">
      <Heading h1>
        Account
      </Heading>

      <div class="md:grid grid-cols-12 gap-8">
        <div class="col-span-12 xl:col-span-6">
          <div class="max-w-lg">
            <Field v-if="profile.avatar_url" label-for="avatar" stacked>
              <img class="w-48 rounded-full" :src="profile.avatar_url">
            </Field>

            <Field v-if="profile.username" stacked>
              <Button :to="`/profile/${profile.username}`">
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
                  :disabled="username === profile.username || !username"
                  @click="username !== profile.username && setUsername()"
                >
                  Set Username
                </Button>
              </div>
            </Field>
            <Notification v-if="!profile.username">
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
