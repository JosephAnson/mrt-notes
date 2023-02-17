<script lang='ts' setup>
import { deleteNote, getAllNotes, setNotes } from '~/services/notes'
import { useNotes } from '~/composables/state'

definePageMeta({
  middleware: 'auth',
})

const { data: asyncNotes } = await useAsyncData('notes', async () => {
  const { data } = await getAllNotes()
  return data
})

const notes = useNotes()

if (asyncNotes.value) {
  setNotes(asyncNotes.value.map(item => ({
    id: item.id,
    name: item.name,
    editor_string: item.editor_string || '',
  })))
}
</script>

<template>
  <Page>
    <Container>
      <Heading h1>
        Notes
      </Heading>

      <CreateNote v-if="notes.length <= 0" />

      <div v-for="note in notes" v-else :key="note.id" class="flex items-center justify-between w-full bg-gray-800 py-1 px-2 rounded mb-1">
        <p> Name: {{ note.name }}</p>

        <div>
          <nuxt-link :to="`/note/${note.id}`" class="mr-2">
            <Button>Open</Button>
          </nuxt-link>

          <Button class="bg-red-700" @click="deleteNote(note.id)">
            Delete
          </Button>
        </div>
      </div>
    </Container>
  </Page>
</template>
