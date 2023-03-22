<script setup lang="ts">
const notesStore = useNotesStore()

await useAsyncData('mostFavouriteNotes', async () => await notesStore.fetchMostFavouriteNotes())
</script>

<template>
  <section>
    <Heading>Most Favourite Notes</Heading>

    <div v-if="notesStore.notes.mostFavourite" class="mb-8">
      <NoteItem
        v-for="note in notesStore.notes.mostFavourite"
        :key="note.id"
        :note="note"
        :show-edit="false"
        :show-delete="false"
      />
    </div>
  </section>
</template>
