<script setup lang="ts">
import { getAllNotesByUserId, setNotes } from '~/services/notes'
import { getProfileByUsername } from '~/services/profile'
import { isUsersNote } from '~/services/user'

const route = useRoute()
const user = useSupabaseUser()
const notes = useNotes()

const usernameParam = getRouterParamsAsString(route.params.username)

const { data: asyncProfile } = await useAsyncData(
  'profile',
  async () => await getProfileByUsername(usernameParam)
)
const { data: asyncNotes } = await useAsyncData(
  'notes',
  async () => await getAllNotesByUserId(asyncProfile.value?.id || '')
)

if (asyncNotes.value) setNotes(asyncNotes.value)
</script>

<template>
  <Page>
    <Container>
      <Heading>{{ asyncProfile.username }}'s Notes</Heading>
      <div class="">
        <NoteItem
          v-for="note in notes"
          :key="note.id"
          :note="note"
          :preview="true"
          :delete="isUsersNote(user?.id, note.user_id)"
        />
      </div>
    </Container>
  </Page>
</template>
