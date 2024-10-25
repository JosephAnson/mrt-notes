<script lang="ts" setup async>
import type { Note } from '~/types'

const user = useSupabaseUser()

const { data: notes } = await useFetch(`/api/notes/user/${user.value?.id}`)
const { data: profile } = await useFetch(`/api/profile/${user.value?.id}`, {
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
        <BaseNotification v-if="user && !profile?.username">
          Set your username on your account if you want to share your profile
          <BaseButton as-child>
            <NuxtLink to="/account" class="ml-4">
              Set Username
            </NuxtLink>
          </BaseButton>
        </BaseNotification>

        <BaseCard class="max-w-xl mb-8">
          <BaseCardBlock>
            <CreateNote />
          </BaseCardBlock>
        </BaseCard>

        <div v-if="user && notes?.length" class="user-information mb-8">
          <div class="md:grid grid-cols-2 gap-4">
            <BaseCard>
              <BaseCardHeader>
                <BaseCardTitle>
                  My Notes
                </BaseCardTitle>
              </BaseCardHeader>
              <BaseCardContent>
                <NoteItem v-for="note in notes" :key="note.id" class="w-full" :note="note" @delete="onDeleteNote" />
              </BaseCardContent>
            </BaseCard>

            <BaseCard>
              <BaseCardHeader class="flex justify-between">
                <div class="flex justify-between gap-4 items-center">
                  <BaseCardTitle>
                    Your Team
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
