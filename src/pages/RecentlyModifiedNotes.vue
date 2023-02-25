<script setup lang="ts">
import { createNotes } from '~/services/notes'

const { data: recentlyModifiedNotes } = await useAsyncData(
  'recentlyModifiedNotes',
  async () => await getAllNotes({ order: 'updated_at', limit: 5 })
)

const notes = recentlyModifiedNotes.value?.map(createNotes) || []
</script>

<template>
  <section v-if="notes.length">
    <Heading>Recently Modified Notes</Heading>
    <div class="mb-8">
      <NoteItem v-for="note in notes" :key="note.id" :note="note" />
    </div>
  </section>
</template>
