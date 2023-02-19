<script lang="ts" setup async>
import { deleteNote, getAllNotes, setNotes } from '~/services/notes'
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

        <section v-if="notes.length">
          <Heading>
            Notes
          </Heading>
          <div class="mb-8">
            <div v-for="note in notes" :key="note.id" class="flex items-center justify-between w-full bg-gray-800 py-1 px-2 rounded mb-2">
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
          </div>
        </section>

        <Heading h3>
          Edit information
        </Heading>

        <nuxt-link class="mr-2" to="team">
          <Button>Edit your team</Button>
        </nuxt-link>
      </div>

      <div class="prose mt-8">
        <p>Website dedicated to making raid leaders lives a little easier with ert note planning, below are some of the features:</p>
        <ul>
          <li>Create and export ert notes</li>
          <li>Change color of text</li>
          <li>Add raid markers</li>
          <li>Add raid teams members and easier add to note</li>
          <li>Add time stamps</li>
          <li>Add spell icons</li>
          <li>Add spell occurrence</li>
          <li>Define groups that notes can be assigned to: Tanks, Healers, DPS, individual players</li>
        </ul>
      </div>

      <div class="prose mt-8">
        <p>
          Working in progress, items still to be completed
        </p>
        <ul>
          <li>
            Import of ert note
          </li>
          <li>
            Copying note
          </li>
        </ul>
      </div>
    </Container>
  </Page>
</template>
