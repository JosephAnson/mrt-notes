<script lang="ts" setup async>
import { paramCase } from 'change-case'
import { getAllUserNotes } from '~/services/notes'
import { getAllTeamMembers } from '~/services/teamMembers'

const user = useSupabaseUser()
const notes = useNotes()
const teamMembers = useTeamMembers()

const { data: asyncNotes } = await useAsyncData(
  'notes',
  async () => await getAllUserNotes()
)
const { data: asyncTeamMembers } = await useAsyncData(
  'teamMembers',
  async () => await getAllTeamMembers()
)

if (user.value) {
  if (asyncNotes.value) setNotes(asyncNotes.value)
  if (asyncTeamMembers.value) setTeamMembers(asyncTeamMembers.value)
}
// Watch to see if user changes to re-fetch notes
watchOnce(
  () => user.value,
  async () => {
    const notes = await getAllUserNotes()
    const teamMembers = await getAllTeamMembers()

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
        <NuxtLink to="login"><Button>Login</Button></NuxtLink>
        <SiteInfo />
      </div>

      <div v-if="user">
        <article class="flex flex-wrap">
          <div class="w-full lg:w-2/3 lg:pr-8">
            <CreateNote />

            <section v-if="notes.length">
              <Heading>My Notes</Heading>
              <div class="mb-8">
                <NoteItem v-for="note in notes" :key="note.id" :note="note" />
              </div>
            </section>

            <SiteInfo />
          </div>

          <aside class="w-full lg:w-1/3 lg:border-l-2 lg:border-black lg:pl-8">
            <div class="flex justify-between items-center">
              <Heading>Your Team</Heading>

              <NuxtLink class="mr-2" to="team">
                <Button>Edit your team</Button>
              </NuxtLink>
            </div>

            <ul>
              <li
                v-for="member in teamMembers"
                :key="member.id"
                :class="`leading-[2] has-wow-text-${paramCase(member.class)}`"
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
