<script setup lang="ts">
const { data: recentlyModifiedNotes } = await useAsyncData(
  'recentlyModifiedNotes',
  async () => await getAllNotes({ order: 'updated_at', limit: 5 })
)

const notes = useRecentlyUpdatedNotes()
if (recentlyModifiedNotes.value) setNotes(notes, recentlyModifiedNotes.value)
</script>

<template>
  <section v-if="notes.length">
    <Heading>Recently Modified Notes</Heading>
    <div class="mb-8">
      <NoteItem v-for="note in notes" :key="note.id" :note="note" :show-edit="false" :show-delete="false" />
    </div>
  </section>
</template>
