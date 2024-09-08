<script setup lang="ts">
import { capitalCase } from 'change-case'
import type { Note } from '~/types'

const user = useSupabaseUser()
const route = useRoute('profile-username')

const usernameParam = getRouterParamsAsString(route.params.username)

const { data: profile } = await useAsyncData('profile', async () => await getProfileByUsername(usernameParam), {
  watch: [user],
  deep: true,
})
const { data: notes } = await useFetch(`/api/notes/user/${profile.value?.id}`)

function onDeleteNote(note: Note) {
  notes.value = notes.value?.filter(n => n.id !== note.id)
}
</script>

<template>
  <BaseSection>
    <BaseContainer>
      <Ad ad-slot="8629692962" />

      <div v-if="profile">
        <Heading h1>
          {{ capitalCase(profile?.username || '') }}'s Profile
        </Heading>

        <CreateNote v-if="user?.id === profile?.id" class="mb-8" />

        <Heading h2>
          {{ capitalCase(profile?.username || '') }}'s Notes
        </Heading>
        <div v-if="notes?.length">
          <NoteItem v-for="note in notes" :key="note.id" :note="note" @delete="onDeleteNote" />
        </div>
        <Heading v-else h2>
          {{ profile.username }} doesn't have any notes
        </Heading>
      </div>
      <Heading v-else h1>
        No profile found
      </Heading>
    </BaseContainer>
  </BaseSection>
</template>
