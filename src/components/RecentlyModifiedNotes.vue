<script setup lang="ts">
const notesStore = useNotesStore()

await useAsyncData('recentlyModifiedNotes', async () => await notesStore.fetchRecentlyModifiedNotes())
</script>

<template>
  <section v-if="notesStore.notes.recentlyModified.length">
    <Heading>Recently Modified Notes</Heading>
    <div class="mb-8">
      <NoteItem
        v-for="note in notesStore.notes.recentlyModified"
        :key="note.id"
        :note="note"
        :show-edit="false"
        :show-delete="false"
      />
    </div>
  </section>
</template>
