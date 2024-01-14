<script lang="ts" setup async>
import { kebabCase } from 'change-case'

const user = useSupabaseUser()
const teamMembersStore = useTeamMembersStore()

const { data: notes } = await useFetch(`/api/notes/user/${user.value?.id}`)
const { data: encounters } = await useFetch('/api/blizzard/latestEncounters')
const { data: profile, pending } = await useFetch(`/api/profile/${user.value?.id}`, {
  headers: useRequestHeaders(['cookie']),
  watch: [user],
})

await useAsyncData('teamMembers', async () => await teamMembersStore.fetchAllTeamMembers())

// Watch to see if user changes to re-fetch notes
watchOnce(
  () => user.value,
  async () => {
    await teamMembersStore.fetchAllTeamMembers()
  },
  { deep: true },
)
</script>

<template>
  <div>
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
    <Ad ad-slot="8629692962" />
    <div>
      <Container>
        <Notification v-if="user && !pending && !profile?.username" class="inline-flex justify-between items-center mb-8">
          Set your username on your account if you want to share your profile
          <Button to="/account" class="ml-4">
            Set Username
          </Button>
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

                <section v-if="notes?.length">
                  <Heading>My Notes</Heading>
                  <div class="mb-8">
                    <NoteItem v-for="note in notes" :key="note.id" :note="note" />
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
                    :class="`leading-[2] has-wow-text-${kebabCase(member.class)}`"
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
                {{ encounter.name }}
              </Button>
            </div>
            <Heading>Mythic+ Dungeons</Heading>
            <div v-if="encounters?.dungeons" class="flex flex-wrap gap-2 mb-2">
              <Button v-for="encounter in encounters.dungeons" :key="encounter" :to="`/search?q=${encounter}#notelist`">
                {{ encounter.name }}
              </Button>
            </div>
          </div>
        </div>
        <div class="md:grid grid-cols-12 gap-8">
          <RecentlyModifiedNotes class="sm:col-span-12 md:col-span-6" />
          <RecentlyCreateNotes class="sm:col-span-12 md:col-span-6" />
        </div>
      </Container>
    </div>

    <Ad ad-slot="9899893676" ad-layout="in-article" />

    <Section class="bg-primary-800">
      <Container>
        <SiteInfo />
      </Container>
    </Section>
  </div>
</template>
