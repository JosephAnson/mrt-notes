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
      <div class="mb-4">
        <div class="md:flex justify-between">
          <div class="flex mb-4 md:mb-0">
            <Heading h1 class="!mb-1"> {{ noteName }} </Heading>

            <NuxtLink v-if="note.username" :to="`/profile/${note.username}`">
              <Heading h2 styled="h1" class="!mb-1">
                {{ `&nbsp;by ${capitalCase(note.username)}` }}
              </Heading>
            </NuxtLink>
          </div>

          <div class="flex items-center grid gap-4">
            <FavouriteButton :note-id="note.id" :count="note.favourites_count"></FavouriteButton>

            <Button v-if="note.username" :to="`/profile/${note.username}`" class="flex"> Visit User Profile </Button>

            <Button v-if="noteIsUsers" :to="`/note/edit/${route.params.id}`" class="bg-red-700 flex-shrink-0">
              Edit Note
            </Button>
          </div>
        </div>

        <div v-if="note.description" class="mb-4">
          <p class="text-gray-500">{{ note.description }}</p>
        </div>
      </div>
      <section>
        <NotePreview :note-json="json" :note-string="editorString" />
      </section>
    </Container>
  </Section>
</template>
