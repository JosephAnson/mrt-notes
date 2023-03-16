<script setup lang="ts">
import { capitalCase } from 'change-case'
import { useSupabaseUser } from '#imports'
import { getAllNotesByUserId, setNotes } from '~/services/notes'
import { getProfileByUsername } from '~/services/profile'

const route = useRoute()
const notes = useNotes()
const user = useSupabaseUser()

const usernameParam = getRouterParamsAsString(route.params.username)

const { data: asyncProfile } = await useAsyncData('profile', async () => await getProfileByUsername(usernameParam))

const { data: asyncNotes } = await useAsyncData(
  'notes',
  async () => await getAllNotesByUserId(asyncProfile.value?.id || '')
)

if (asyncNotes.value) setNotes(asyncNotes.value)
</script>

<template>
  <Section>
    <Container>
      <div v-if="asyncProfile">
        <Heading h1> {{ capitalCase(asyncProfile?.username || '') }}'s Profile </Heading>

        <CreateNote v-if="user?.id === asyncProfile?.id" />

        <Heading h2> {{ capitalCase(asyncProfile?.username || '') }}'s Notes </Heading>
        <div v-if="notes.length">
          <NoteItem v-for="note in notes" :key="note.id" :note="note" />
        </div>
        <Heading v-else h2> {{ asyncProfile.username }} doesn't have any notes </Heading>
      </div>
      <Heading v-else h1>No profile found</Heading>
    </Container>
  </Section>
</template>
