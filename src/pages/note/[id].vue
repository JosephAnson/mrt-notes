<script lang="ts" setup>
import { generateJSON } from '@tiptap/html'
import { capitalCase } from 'change-case'
import { useSupabaseUser } from '#imports'
import { editorExtensions } from '~/utils/editor'

const user = useSupabaseUser()
const route = useRoute<'note-id'>()
const groupsStore = useGroupsStore()

const { data: note } = await useAsyncData('notes', async () => {
  return await getNote(getRouterParamsAsString(route.params.id))
})
await useAsyncData('groups', async () => {
  if (note.value) {
    await groupsStore.fetchAllGroups(note.value.id)
  }
})

const noteName = computed(() => (note.value?.name ? capitalCase(note.value.name) : 'No Name'))
const noteIsUsers = computed(() => isUsersNote(user.value?.id, note.value?.user_id))
const editorString = computed(() => note.value?.editor_string || '')
const json = computed(() => generateJSON(editorString.value, editorExtensions))
</script>

<template>
  <Section>
    <Container v-if="note">
      <div class="flex justify-between mb-4">
        <div class="flex">
          <Heading h1> {{ noteName }} </Heading>

          <NuxtLink v-if="note.username" :to="`/profile/${note.username}`">
            <Heading h2 styled="h1">
              {{ `&nbsp;by ${capitalCase(note.username)}` }}
            </Heading>
          </NuxtLink>
        </div>

        <div class="flex items-center">
          <NuxtLink v-if="note.username" :to="`/profile/${note.username}`" class="flex ml-6">
            <Button> Visit User Profile </Button>
          </NuxtLink>

          <FavouriteButton :note-id="note.id" :count="note.favourites_count"></FavouriteButton>

          <NuxtLink v-if="noteIsUsers" :to="`/note/edit/${route.params.id}`" class="flex ml-6">
            <Button class="bg-red-700 flex-shrink-0"> Edit Note </Button>
          </NuxtLink>
        </div>
      </div>

      <section>
        <NotePreview :note-json="json" :note-string="editorString" />
      </section>
    </Container>
  </Section>
</template>
