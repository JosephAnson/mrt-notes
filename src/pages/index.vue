<script lang="ts" setup async>
import { deleteNote, getAllNotes, setNotes } from '~/services/notes'
import Heading from '~/components/Heading.vue'
import { getAllTeamMembers, setTeamMembers } from '~/services/teamMembers'

const user = useSupabaseUser()
const teamMember = useTeamMembers()
const notes = useNotes()

const { data: asyncNotes } = await getAllNotes()
const { data: asyncTeamMembers } = await getAllTeamMembers()

if (asyncTeamMembers.value)
  setTeamMembers(asyncTeamMembers.value)

function setGlobalNotes(data: { id: number; name: string; editor_string: string | null }[] | null) {
  if (data)
    setNotes(data)
}

setGlobalNotes(asyncNotes.value)

// Watch to see if user changes to re-fetch notes
watch(() => user.value, async () => {
  const { data } = await getAllNotes()
  setGlobalNotes(data)
}, { deep: true })
</script>

<template>
  <Page>
    <Container>
      <!-- {{ teamMember }} -->
      <Heading h1>
        Homepage
      </Heading>

      <Heading h2 class="mb-8">
        Website to handle all your World of Warcraft MRT Notes
      </Heading>

      <div v-if="!user">
        <Heading class="mb-4">
          Login to get started
        </Heading>
        <LoginButtons />
        <SiteInfo />
      </div>

      <div v-if="user">
        <article class="flex flex-wrap">
          <div class=" w-full lg:w-2/3 lg:pr-8">
            <CreateNote />

            <section v-if="notes.length">
              <Heading>
                Notes
              </Heading>
              <div class="mb-8">
                <div v-for="note in notes" :key="note.id"
                  class="flex items-center justify-between w-full bg-gray-800 py-1 px-2 rounded mb-2">
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

            <SiteInfo />
          </div>

          <aside class="w-full lg:w-1/3 lg:border-l-2 lg:border-black lg:pl-8">
            <div class="flex justify-between items-center">
              <Heading>Your Team</Heading>

              <nuxt-link class="mr-2" to="team">
                <Button>Edit your team</Button>
              </nuxt-link>
            </div>

            <ul v-for="member in teamMember">
              <li :class="`leading-[2] has-wow-text-${toParamCase(member.class)}`" :key="member.id">{{ member.name }}</li>
            </ul>
          </aside>
        </article>
      </div>

    </Container>
  </Page>
</template>
