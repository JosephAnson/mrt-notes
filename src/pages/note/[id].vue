<script lang="ts" setup>
import { generateJSON } from '@tiptap/html'
import { useSupabaseUser } from '#imports'
import type { GroupTypeUnion } from '~/types'
import { editorExtensions } from '~/utils/editor'

const user = useSupabaseUser()
const route = useRoute()

const { data: note } = await useAsyncData('notes', async () => {
  const { data } = await getNote(getRouterParamsAsString(route.params.id))
  return data
})

const noteIsUsers = computed(
  () => user.value && note.value && user.value.id === note.value.user_id
)

const editorString = computed(() => note.value?.editor_string || '')
const json = computed(() => generateJSON(editorString.value, editorExtensions))

const { data: asyncGroups } = await useAsyncData('groups', async () => {
  if (note.value) {
    const { data } = await getAllGroups(note.value.id)
    return data
  }
})

if (asyncGroups.value) {
  setGroups(
    asyncGroups.value.map((item, index) => ({
      id: item.id,
      note: {
        value: item.editor_string || '',
        json: generateJSON(item.editor_string || '', editorExtensions),
      },
      order: index,
      type: (item.type as GroupTypeUnion) || 'Players',
      players: item.players || [],
    }))
  )
}
</script>

<template>
  <Page>
    <Container>
      <div class="flex justify-between mb-4">
        <Heading h1> Mrt Notes </Heading>

        <NuxtLink
          v-if="noteIsUsers"
          :to="`/note/edit/${route.params.id}`"
          class="flex"
        >
          <Button class="bg-red-700 flex-shrink-0"> Edit Note </Button>
        </NuxtLink>
      </div>

      <section>
        <NotePreview :note-json="json" :note-string="editorString" />
      </section>
    </Container>
  </Page>
</template>
