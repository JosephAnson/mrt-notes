<script setup lang="ts">
import { capitalCase } from 'change-case'

const user = useSupabaseUser()
const route = useRoute()
const notesStore = useNotesStore()
const userStore = useUserStore()

await useAsyncData('userFavourites', async () => await userStore.fetchUserFavourites(user.value?.id))
const usernameParam = getRouterParamsAsString(route.params.username)

const { data: asyncProfile } = await useAsyncData('profile', async () => await getProfileByUsername(usernameParam))

await useAsyncData('notes', async () => await notesStore.fetchAllUserNotes(asyncProfile.value?.id || ''))
</script>

<template>
  <Section>
    <Container>
      <div v-if="asyncProfile">
        <Heading h1> {{ capitalCase(asyncProfile?.username || '') }}'s Profile </Heading>

        <CreateNote v-if="user?.id === asyncProfile?.id" />

        <Heading h2> {{ capitalCase(asyncProfile?.username || '') }}'s Notes </Heading>
        <div v-if="notesStore.notes.user.length">
          <NoteItem v-for="note in notesStore.notes.user" :key="note.id" :note="note" />
        </div>
        <Heading v-else h2> {{ asyncProfile.username }} doesn't have any notes </Heading>
      </div>
      <Heading v-else h1>No profile found</Heading>
    </Container>
  </Section>
</template>
