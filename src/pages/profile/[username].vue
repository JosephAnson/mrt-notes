<script setup lang="ts">
import { getAllNotesByUserId } from '~/services/notes'
import { getProfileByUsername } from '~/services/profile'

const route = useRoute()
const usernameParam = getRouterParamsAsString(route.params.username)

const { data: profile } = await useAsyncData(
  'profile',
  async () => await getProfileByUsername(usernameParam)
)
const { data: notes } = await useAsyncData(
  'notes',
  async () => await getAllNotesByUserId(profile.value?.id || '')
)
</script>

<template>
  <Page>
    <Container>
      <Heading>{{ profile.username }}'s Notes</Heading>
      <div class="">
        <NoteItem
          v-for="note in notes"
          :key="note.id"
          :note="note"
          :preview="true"
        />
      </div>
    </Container>
  </Page>
</template>
