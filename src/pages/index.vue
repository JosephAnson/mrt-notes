<script lang="ts" setup async>
import { getAllNotes, setNotes } from '~/services/notes'
import Heading from '~/components/Heading.vue'

const user = useSupabaseUser()

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
        Homepage
      </Heading>

      <Heading h2 class="mb-8">
        Website to handle all your World of Warcraft ERT Notes
      </Heading>

      <div v-if="!user">
        <Heading class="mb-4">
          Login to get started
        </Heading>
        <LoginButtons />
      </div>
      <div v-if="user">
        <CreateNote />

        <Heading>
          Notes
        </Heading>
        <div v-for="note in notes" :key="note.id" class="flex items-center justify-between w-full bg-gray-800 py-1 px-2 rounded mb-8">
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

        <Heading h3>
          Edit information
        </Heading>

        <nuxt-link class="mr-2" to="team">
          <Button>Edit your team</Button>
        </nuxt-link>

        <div class="prose mt-8">
          <p>
            Working in progress, items still to be completed
          </p>
          <ul>
            <li>
              Import of ert note
            </li>
          </ul>
        </div>
      </div>
    </Container>
  </Page>
</template>
