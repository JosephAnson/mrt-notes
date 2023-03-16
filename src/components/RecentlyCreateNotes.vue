<script setup lang="ts">
import { createNotes } from '~/services/notes'

const { data: recentlyCreatedNotes } = await useAsyncData(
  'recentlyCreatedNotes',
  async () => await getAllNotes({ limit: 5 })
)

const notes = recentlyCreatedNotes.value?.map(createNotes) || []
</script>

<template>
  <section v-if="notes.length">
    <Heading>Recently Created Notes</Heading>
    <div class="mb-8">
      <NoteItem v-for="note in notes" :key="note.id" :note="note" :show-edit="false" :show-delete="false" />
    </div>
  </section>
</template>
