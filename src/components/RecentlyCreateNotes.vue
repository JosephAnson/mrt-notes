<script setup lang="ts">
const notesStore = useNotesStore()

await useAsyncData(
  'recentlyCreatedNotes',
  async () => await notesStore.fetchRecentlyCreatedNotes()
)
</script>

<template>
  <section v-if="notesStore.notes.recentlyCreated.length">
    <Heading>Recently Created Notes</Heading>
    <div class="mb-8">
      <NoteItem
        v-for="note in notesStore.notes.recentlyCreated"
        :key="note.id"
        :note="note"
        :show-edit="false"
        :show-delete="false"
      />
    </div>
  </section>
</template>
