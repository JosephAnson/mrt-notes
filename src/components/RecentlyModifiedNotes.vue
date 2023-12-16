<script setup lang="ts">
const notesStore = useNotesStore()

const recentlyModifiedNotes = await useFetch('/api/notes/recentlyModifiedNotes')
</script>

<template>
  <section v-if="recentlyModifiedNotes.length">
    <Heading>Recently Modified Notes</Heading>
    <div class="mb-8">
      <NoteItem
        v-for="note in recentlyModifiedNotes"
        :key="note.id"
        :note="note"
        :show-edit="false"
        :show-delete="false"
      />
    </div>
  </section>
</template>
