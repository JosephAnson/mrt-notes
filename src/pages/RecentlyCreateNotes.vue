<script setup lang="ts">
const { data: recentlyCreatedNotes } = await useAsyncData(
  'recentlyCreatedNotes',
  async () => await getAllNotes({ limit: 5 })
)
</script>

<template>
  <section v-if="recentlyCreatedNotes.length">
    <Heading>Recently Created Notes</Heading>
    <div class="mb-8">
      <NoteItem
        v-for="note in recentlyCreatedNotes"
        :key="note.id"
        :note="note"
      />
    </div>
  </section>
</template>
