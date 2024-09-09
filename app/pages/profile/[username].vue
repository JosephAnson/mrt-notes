<script setup lang="ts">
import { capitalCase } from 'change-case'
import type { Note } from '~/types'

const user = useSupabaseUser()
const route = useRoute('profile-username')
const usernameParam = getRouterParamsAsString(route.params.username)

const { data: profile } = await useFetch('/api/profile/getByUsername', {
  query: { username: usernameParam },
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
        <BaseHeading h1>
          {{ capitalCase(profile?.username || '') }}'s Profile
        </BaseHeading>

        <CreateNote v-if="user?.id === profile?.id" class="mb-8" />

        <BaseHeading h2>
          {{ capitalCase(profile?.username || '') }}'s Notes
        </BaseHeading>
        <div v-if="notes?.length">
          <NoteItem v-for="note in notes" :key="note.id" :note="note" @delete="onDeleteNote" />
        </div>
        <BaseHeading v-else h2>
          {{ profile.username }} doesn't have any notes
        </BaseHeading>
      </div>
      <BaseHeading v-else h1>
        No profile found
      </BaseHeading>
    </BaseContainer>
  </BaseSection>
</template>
