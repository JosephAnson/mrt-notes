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

const { data: encounters } = await useLazyAsyncData('encounters', async () => await getLatestEncounters())

// Watch to see if user changes to re-fetch notes
watchOnce(
  () => user.value,
  async () => {
    await notesStore.fetchAllUserNotes(user.value?.id || '')
    await userStore.fetchUserFavourites(user.value?.id)
    await teamMembersStore.fetchAllTeamMembers()
  },
  { deep: true },
)
</script>

<template>
  <Section class="bg-primary-500">
    <Container>
      <div class="md:flex justify-between">
        <div>
          <Heading h1 class="!mb-0">
            Welcome to MRT Notes: Your Ultimate Raid Planning Companion
          </Heading>
        </div>

        <Button
          tag="a"
          target="_blank"
          rel="noreferrer nofollow"
          href="https://www.curseforge.com/wow/addons/method-raid-tools"
          class="!bg-[#F16436]"
        >
          Download MRT WoW Addon
        </Button>
      </div>
    </Container>
  </Section>
  <Ad max-height ad-slot="8629692962" />
  <Section>
    <Container>
      <Notification v-if="user && !profileStore.username" class="inline-flex justify-between items-center mb-8">
        Set your username on your account if you want to share your profile
        <nuxt-link to="/account">
          <Button class="ml-4">
            Set Username
          </Button>
        </nuxt-link>
      </Notification>
      <div class="user-information mb-8">
        <div v-if="!user" class="bg-gray-900 p-4 rounded flex items-center">
          <Heading class="mr-4 !mb-0" h2>
            Login to get started
          </Heading>
          <Button to="login">
            Login
          </Button>
        </div>

        <div v-if="user" class="mt-4 bg-gray-900 p-4 rounded">
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

                <Button class="mr-2" to="team">
                  Edit your team
                </Button>
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

        <div class="mt-4 mb-8 bg-gray-900 p-4 rounded">
          <div class="flex items-center mb-4">
            <Heading h2 styled="h3" class="!mb-0">
              Search by encounter
            </Heading>
            <NuxtLink class="ml-6 text-sm font-semibold uppercase" to="allencounters">
              View all
            </NuxtLink>
          </div>
          <Heading>Raids</Heading>
          <div v-if="encounters?.raids" class="flex flex-wrap gap-2 mb-4">
            <Button v-for="encounter in encounters.raids" :key="encounter" :to="`/search?q=${encounter}#notelist`">
              {{ encounter }}
            </Button>
          </div>
          <Heading>Mythic+ Dungeons</Heading>
          <div v-if="encounters?.dungeons" class="flex flex-wrap gap-2 mb-2">
            <Button v-for="encounter in encounters.dungeons" :key="encounter" :to="`/search?q=${encounter}#notelist`">
              {{ encounter }}
            </Button>
          </div>
        </div>
      </div>
      <div class="md:grid grid-cols-12 gap-8">
        <RecentlyModifiedNotes class="sm:col-span-12 md:col-span-6" />
        <RecentlyCreateNotes class="sm:col-span-12 md:col-span-6" />
        <MostFavouriteNotes class="sm:col-span-12 md:col-span-6" />
      </div>
    </Container>
  </Section>

  <Ad ad-slot="9899893676" ad-layout="in-article" />

  <Section class="bg-primary-800">
    <Container>
      <SiteInfo />
    </Container>
  </Section>
</template>
