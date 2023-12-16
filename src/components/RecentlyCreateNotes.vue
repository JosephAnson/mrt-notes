<script setup lang="ts">
const recentlyCreatedNotes = await useFetch('/api/notes/recentlyCreatedNotes')
</script>

<template>
  <section v-if="recentlyCreatedNotes.length">
    <Heading>Recently Created Notes</Heading>
    <div class="mb-8">
      <NoteItem
        v-for="note in recentlyCreated"
        :key="note.id"
        :note="note"
        :show-edit="false"
        :show-delete="false"
      />
    </div>
  </section>
</template>
