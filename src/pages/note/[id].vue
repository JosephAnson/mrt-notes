<script lang="ts" setup>
import { generateJSON } from '@tiptap/html'
import { capitalCase } from 'change-case'
import { useSupabaseUser } from '#imports'
import { editorExtensions } from '~/utils/editor'

const user = useSupabaseUser()
const route = useRoute()
const groupsStore = useGroupsStore()

const { data: note } = await useAsyncData('notes', async () => {
  return await getNote(getRouterParamsAsString(route.params.id))
})
await useAsyncData('groups', async () => {
  if (note.value) {
    await groupsStore.fetchAllGroups(note.value.id)
  }
})

const noteIsUsers = computed(() => isUsersNote(user.value?.id, note.value?.user?.id))
const editorString = computed(() => note.value?.editor_string || '')
const json = computed(() => generateJSON(editorString.value, editorExtensions))
</script>

<template>
  <Section>
    <Container>
      <div class="flex justify-between mb-4">
        <div>
          <Heading h1> {{ capitalCase(note?.name) || 'No Name' }} - MRT Note </Heading>

          <Heading v-if="note.user.username" h2>
            {{ `written by ${capitalCase(note.user.username)}` }}
          </Heading>
        </div>

        <div class="flex items-center">
          <FavouriteButton :note-id="note.id"></FavouriteButton>

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
