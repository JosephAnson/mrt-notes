<script setup lang="ts">
const { data: recentlyModifiedNotes } = await useAsyncData(
  'recentlyModifiedNotes',
  async () => await getAllNotes({ order: 'updated_at', limit: 5 })
)
</script>

<template>
  <section v-if="recentlyModifiedNotes.length">
    <Heading>Recently Modified Notes</Heading>
    <div class="mb-8">
      <NoteItem
        v-for="note in recentlyModifiedNotes"
        :key="note.id"
        :note="note"
      />
    </div>
  </section>
</template>
