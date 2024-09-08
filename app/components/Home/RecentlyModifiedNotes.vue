<script setup lang="ts">
const { data } = await useFetch('/api/notes/recentlyModifiedNotes')
</script>

<template>
  <section v-if="data">
    <BaseHeading>Recently Modified Notes</BaseHeading>
    <div class="mb-8">
      <NoteItem
        v-for="note in data"
        :key="note.id"
        :note="note"
        :show-edit="false"
        :show-delete="false"
      />
    </div>
  </section>
</template>
