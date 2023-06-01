<script lang="ts" setup async>
import { paramCase } from 'change-case'

const user = useSupabaseUser()
const notesStore = useNotesStore()
const userStore = useUserStore()
const profileStore = useProfileStore()
const teamMembersStore = useTeamMembersStore()

await useAsyncData('userFavourites', async () => await userStore.fetchUserFavourites(user.value?.id))
await useAsyncData('notes', async () => await notesStore.fetchAllUserNotes(user.value?.id))
await useAsyncData('teamMembers', async () => await teamMembersStore.fetchAllTeamMembers())

// Watch to see if user changes to re-fetch notes
watchOnce(
  () => user.value,
  async () => {
    await notesStore.fetchAllUserNotes(user.value?.id || '')
    await userStore.fetchUserFavourites(user.value?.id)
    await teamMembersStore.fetchAllTeamMembers()
  },
  { deep: true }
)
</script>

<template>
  <Section>
    <Container>
      <div class="md:flex justify-between mb-8 md:mb-0">
        <div>
          <Heading h1> Website to handle all your World of Warcraft MRT Notes </Heading>
        </div>

        <Button
          tag="a"
          target="_blank"
          rel="noreferrer nofollow"
          href="https://www.curseforge.com/wow/addons/method-raid-tools"
          class="!bg-[#F16436]"
        >
          Download MRT WoW Addon</Button
        >
      </div>
      <Notification v-if="user && !profileStore.username" class="inline-flex justify-between items-center mb-8">
        Set your username on your account if you want to share your profile
        <nuxt-link to="/account"> <Button class="ml-4">Set Username</Button></nuxt-link>
      </Notification>
      <div class="user-information mb-8">
        <div v-if="!user" class="bg-primary-700 p-8 rounded flex items-center">
          <Heading class="mr-4 !mb-0" h2> Login to get started</Heading>
          <NuxtLink to="login"><Button>Login</Button></NuxtLink>
        </div>

        <div v-if="user">
          <div class="flex flex-wrap">
            <div class="w-full lg:w-2/3 lg:pr-8">
              <CreateNote />

              <section v-if="notesStore.notes.user.length">
                <Heading>My Notes</Heading>
                <div class="mb-8">
                  <NoteItem v-for="note in notesStore.notes.user" :key="note.id" :note="note" />
                </div>
              </section>
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
                  v-for="member in teamMembersStore.members"
                  :key="member.id"
                  :class="`leading-[2] has-wow-text-${paramCase(member.class)}`"
                >
                  {{ member.name }}
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </div>
      <div class="md:grid grid-cols-12 gap-8">
        <MostFavouriteNotes class="sm:col-span-12 md:col-span-6" />
        <RecentlyModifiedNotes class="sm:col-span-12 md:col-span-6" />
        <RecentlyCreateNotes class="sm:col-span-12 md:col-span-6" />
      </div>
    </Container>
  </Section>
  <adsbygoogle />
  <Section class="bg-primary-800">
    <Container>
      <SiteInfo />
    </Container>
  </Section>
</template>
