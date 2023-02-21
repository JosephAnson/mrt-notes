<script lang="ts" setup async>
const user = useSupabaseUser()
const notes = useNotes()
const teamMembers = useTeamMembers()

const { data: asyncNotes } = await useAsyncDataGetAllNotes()
const { data: asyncTeamMembers } = await useAsyncDataAllTeamMembers()

if (user.value) {
  if (asyncNotes.value) setNotes(asyncNotes.value)
  if (asyncTeamMembers.value) setTeamMembers(asyncTeamMembers.value)
}
// Watch to see if user changes to re-fetch notes
watchOnce(
  () => user.value,
  async () => {
    const { data: notes } = await getAllNotes()
    const { data: teamMembers } = await getAllTeamMembers()

    if (notes) setNotes(notes)
    if (teamMembers) setTeamMembers(teamMembers)
  },
  { deep: true }
)
</script>

<template>
  <Page>
    <Container>
      <Heading h1> Homepage</Heading>

      <Heading h2 class="mb-8">
        Website to handle all your World of Warcraft MRT Notes
      </Heading>

      <div v-if="!user">
        <Heading class="mb-4"> Login to get started</Heading>
        <LoginButtons />
        <SiteInfo />
      </div>

      <div v-if="user">
        <article class="flex flex-wrap">
          <div class="w-full lg:w-2/3 lg:pr-8">
            <CreateNote />

            <section v-if="notes.length">
              <Heading>My Notes</Heading>
              <div class="mb-8">
                <div
                  v-for="note in notes"
                  :key="note.id"
                  class="flex items-center justify-between w-full bg-gray-800 py-1 px-2 rounded mb-2"
                >
                  <p>Name: {{ note.name }}</p>

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

            <ul>
              <li
                v-for="member in teamMembers"
                :key="member.id"
                :class="`leading-[2] has-wow-text-${toParamCase(member.class)}`"
              >
                {{ member.name }}
              </li>
            </ul>
          </aside>
        </article>
      </div>
    </Container>
  </Page>
</template>
