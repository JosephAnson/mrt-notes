<script lang="ts" setup async>
import type { Note } from '~/types'

const user = useSupabaseUser()

const { data: notes } = await useFetch(`/api/notes/user/${user.value?.id}`)
const { data: encounters } = await useFetch('/api/blizzard/latestEncounters')
const { data: profile, pending } = await useFetch(`/api/profile/${user.value?.id}`, {
  headers: useRequestHeaders(['cookie']),
  watch: [user],
})

function onDeleteNote(note: Note) {
  notes.value = notes.value?.filter(n => n.id !== note.id)
}
</script>

<template>
  <div>
    <BaseSection class="bg-white/10">
      <BaseContainer>
        <div class="flex flex-col gap-4 md:flex-row justify-between">
          <div>
            <BaseHeading h1 class="!mb-0">
              Welcome to MRT Notes: Your Ultimate Raid Planning Companion
            </BaseHeading>
          </div>

          <BaseButton
            as="a"
            target="_blank"
            rel="noreferrer nofollow"
            href="https://www.curseforge.com/wow/addons/method-raid-tools"
            class="!bg-[#F16436]"
          >
            Download MRT WoW Addon
          </BaseButton>
        </div>
      </BaseContainer>
    </BaseSection>
    <Ad ad-slot="8629692962" />
    <div>
      <BaseContainer>
        <BaseNotification v-if="user && !pending && !profile?.username">
          Set your username on your account if you want to share your profile
          <BaseButton as-child>
            <NuxtLink to="/account" class="ml-4">
              Set Username
            </NuxtLink>
          </BaseButton>
        </BaseNotification>
        <div class="user-information mb-8">
          <BaseCard v-if="!user">
            <BaseCardBlock class="flex items-center">
              <BaseHeading class="mr-4 !mb-0" h2>
                Login to get started
              </BaseHeading>
              <BaseButton as-child>
                <NuxtLink to="/login">
                  Login
                </NuxtLink>
              </BaseButton>
            </BaseCardBlock>
          </BaseCard>

          <div class="md:flex gap-4">
            <div>
              <BaseCard v-if="user">
                <BaseCardBlock>
                  <div class="flex flex-wrap">
                    <div class="w-full lg:w-2/3 lg:pr-8">
                      <CreateNote />

                      <div v-if="notes?.length">
                        <BaseHeading>My Notes</BaseHeading>
                        <NoteItem v-for="note in notes" :key="note.id" :note="note" @delete="onDeleteNote" />
                      </div>
                    </div>
                  </div>
                </BaseCardBlock>
              </BaseCard>
              <BaseCard class="mt-4">
                <BaseCardBlock>
                  <div class="flex items-center mb-4">
                    <BaseHeading h2 styled="h3" class="!mb-0">
                      Search by encounter
                    </BaseHeading>
                    <NuxtLink class="ml-6 text-sm font-semibold uppercase" to="/allencounters">
                      View all
                    </NuxtLink>
                  </div>
                  <BaseHeading>Raids</BaseHeading>
                  <div v-if="encounters?.raids" class="flex flex-wrap gap-2 mb-4">
                    <BaseButton v-for="encounter in encounters.raids" :key="encounter.id" size="sm" as-child>
                      <NuxtLink :to="`/search?q=${encounter.name}#notelist`">
                        {{ encounter.name }}
                      </NuxtLink>
                    </BaseButton>
                  </div>
                  <BaseHeading>Mythic+ Dungeons</BaseHeading>
                  <div v-if="encounters?.dungeons" class="flex flex-wrap gap-2 mb-2">
                    <BaseButton v-for="encounter in encounters.dungeons" :key="encounter.id" size="sm" as-child>
                      <NuxtLink :to="`/search?q=${encounter.name}#notelist`">
                        {{ encounter.name }}
                      </NuxtLink>
                    </BaseButton>
                  </div>
                </BaseCardBlock>
              </BaseCard>
            </div>
            <BaseCard v-if="user" class="lg:w-1/2">
              <BaseCardHeader class="flex justify-between">
                <div class="flex justify-between gap-4 items-center">
                  <BaseCardTitle as-child>
                    <BaseHeading h2 styled="h3" class="!mb-0">
                      Your Team
                    </BaseHeading>
                  </BaseCardTitle>

                  <BaseButton as-child>
                    <NuxtLink to="/team">
                      Edit your team
                    </NuxtLink>
                  </BaseButton>
                </div>
              </BaseCardHeader>
              <BaseCardContent>
                <TeamList />
              </BaseCardContent>
            </BaseCard>
          </div>
        </div>

        <div class="md:grid grid-cols-12 gap-8">
          <HomeRecentlyModifiedNotes class="sm:col-span-12 md:col-span-6" />
          <HomeRecentlyCreateNotes class="sm:col-span-12 md:col-span-6" />
        </div>
      </BaseContainer>
    </div>

    <Ad ad-slot="9899893676" ad-layout="in-article" />

    <BaseSection class="bg-white/5">
      <BaseContainer>
        <div class="prose prose-invert">
          <BaseHeading h3>
            Features
          </BaseHeading>
          <div class="mt-8">
            <p>
              Website dedicated to making raid leaders lives a little easier with mrt note planning, below are some of the
              features:
            </p>
            <ul>
              <li>Create, share, favorite and export mrt notes</li>
              <li>Share Profiles</li>
              <li>Preview Notes</li>
            </ul>
            <p>Editor Features:</p>
            <ul>
              <li>Based on boss selection automatically generate buttons to add boss spells to your note</li>
              <li>
                Auto transform pasted MRT note, current support is:
                <ul>
                  <li>Spells</li>
                  <li>Colors</li>
                  <li>Raid Markers</li>
                  <li>Timers</li>
                </ul>
              </li>
              <li>Change color of text</li>
              <li>Add raid markers</li>
              <li>Add raid teams members and easier add to note</li>
              <li>Add time stamps</li>
              <li>Add spell icons</li>
              <li>Add spell occurrence</li>
              <li>Define groups that notes can be assigned to: Tanks, Healers, DPS, individual players</li>
            </ul>
          </div>
        </div>
      </BaseContainer>
    </BaseSection>
  </div>
</template>
