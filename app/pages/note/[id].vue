<script lang="ts" setup>
import { generateJSON } from '@tiptap/html'
import { capitalCase } from 'change-case'
import type { Ref } from 'vue'
import { useSupabaseUser } from '#imports'
import type { Note } from '~/types'
import { editorExtensions } from '~/utils/editor'

const user = useSupabaseUser()
const route = useRoute('note-id')

const { data: note } = await useFetch(`/api/notes/${route.params.id}`) as unknown as { data: Ref<Note> }
const { data: userNotes } = await useFetch(`/api/notes/user/${note.value?.user_id}`)

const noteName = computed(() => (note.value?.name ? capitalCase(note.value?.name) : 'No Name'))
const noteIsUsers = computed(() => isUsersNote(user.value?.id, note.value?.user_id))
const editorString = computed(() => note.value?.editor_string || '')
const json = computed(() => generateJSON(editorString.value, editorExtensions))

useSeoMeta({
  title: noteName,
})
</script>

<template>
  <Section>
    <Ad ad-slot="9530994485" />

    <Container v-if="note">
      <div class="md:grid grid-cols-12 gap-8">
        <div class="sm:col-span-12 md:col-span-9">
          <div class="mb-4">
            <div class="md:flex justify-between">
              <div class="flex mb-4 md:mb-0">
                <Heading h1 class="!mb-1">
                  {{ noteName }}
                </Heading>

                <NuxtLink v-if="note.username" :to="`/profile/${note.username}`">
                  <Heading h2 styled="h1" class="!mb-1">
                    {{ `&nbsp;by ${capitalCase(note.username)}` }}
                  </Heading>
                </NuxtLink>
              </div>

              <div class="flex items-center gap-4">
                <BaseButton v-if="note.username" as-child class="flex">
                  <NuxtLink :to="`/profile/${note.username}`">
                    Visit User Profile
                  </NuxtLink>
                </BaseButton>

                <BaseButton v-if="noteIsUsers" as-child class="bg-red-700 flex-shrink-0">
                  <NuxtLink :to="`/note/edit/${route.params.id}`">
                    Edit Note
                  </NuxtLink>
                </BaseButton>
              </div>
            </div>

            <div v-if="note.description" class="mb-4">
              <p class="text-gray-500">
                {{ note.description }}
              </p>
            </div>
          </div>
          <section>
            <NotePreview :note-json="json" :note-string="editorString" />
          </section>
        </div>
        <div v-if="note && userNotes?.length" class="sm:col-span-12 md:col-span-3">
          <Heading v-if="note?.username" h2>
            {{ capitalCase(note.username) }}'s Notes
          </Heading>
          <Heading v-else h2>
            Related Notes
          </Heading>
          <div v-if="userNotes.length" class="overflow-y-auto h-screen">
            <NoteItem v-for="userNote in userNotes" :key="userNote.id" :note="userNote" />
          </div>
        </div>
      </div>
    </Container>
  </Section>
</template>
