<script setup lang="ts">
import { toast } from 'vue-sonner'

definePageMeta({
  middleware: 'auth',
})

const user = useSupabaseUser()

const { data: profile, refresh } = await useFetch(`/api/profile/${user.value?.id}`, {
  headers: useRequestHeaders(['cookie']),
  watch: [user],
})

const username = ref<string>(profile.value?.username || '')

async function setUsername() {
  if (!username.value) {
    toast.error('Username cannot be empty!')
  }
  else {
    const data = await $fetch('/api/profile/updateUsername', { query: { username: username.value } })

    if (!data) {
      toast.error('Username exists try another!')
    }
    else {
      if (data.username)
        username.value = data.username

      await refresh()

      toast.success('Saved username')
    }
  }
}
</script>

<template>
  <BaseSection>
    <BaseContainer v-if="profile">
      <BaseCard class="max-w-2xl mx-auto">
        <BaseCardHeader>
          <div class="flex items-center space-x-4">
            <BaseAvatar v-if="profile.avatar_url" class="w-20 h-20">
              <BaseAvatarImage alt="User" :src="profile.avatar_url" />
              <BaseAvatarFallback>{{ profile.username }}</BaseAvatarFallback>
            </BaseAvatar>
            <div>
              <BaseCardTitle as-child>
                <BaseHeading h1 styled="h3" class="mb-0">
                  Account
                </BaseHeading>
              </BaseCardTitle>
              <BaseCardDescription>Manage your account settings</BaseCardDescription>
            </div>
          </div>
        </BaseCardHeader>
        <BaseCardContent class="space-y-4">
          <div class="space-y-2">
            <BaseField v-if="user?.email" label-for="avatar_url" label="Email" stacked>
              <BaseInput id="avatar_url" v-model="user.email" type="text" disabled />
            </BaseField>
          </div>
          <div class="space-y-2">
            <BaseField label-for="username" label="Username" stacked>
              <div class="flex">
                <BaseInput id="username" v-model="username" type="text" class="mr-2" />
                <BaseButton
                  :disabled="username === profile.username || !username"
                  @click="username !== profile.username && setUsername()"
                >
                  {{ profile.username ? ' Change Username' : 'Set Username' }}
                </BaseButton>
              </div>
            </BaseField>
            <BaseNotification v-if="!profile.username">
              Set a username if you want to share your profile
            </BaseNotification>
          </div>

          <BaseField
            v-if="user"
            label="Signed up with"
          >
            <div class="flex gap-2 flex-wrap">
              <span
                v-for="provider in user.app_metadata.providers"
                :key="provider"
              >
                <div class="flex items-center gap-2 pt-1 font-bold">
                  <Icon :name="`bi:${provider}`" />
                  <span>{{ provider.toUpperCase() }}</span>
                </div>
              </span>
            </div>
          </BaseField>
        </BaseCardContent>
        <BaseSeparator />
        <BaseCardBlock class="flex justify-between">
          <BaseButton as-child>
            <NuxtLink :to="`/profile/${profile.username}`">
              View Profile
            </NuxtLink>
          </BaseButton>
        </BaseCardBlock>
      </basecard>
    </BaseContainer>
  </BaseSection>
</template>
