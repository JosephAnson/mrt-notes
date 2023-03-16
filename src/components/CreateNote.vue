<script setup lang="ts">
const noteName = ref('')
</script>

<template>
  <Heading h3> Create New Note </Heading>
  <form class="mb-8 flex" @submit.prevent="createNewNote(noteName)">
    <Input v-model="noteName" class="mr-2" placeholder="Enter name for note" />
    <Button :disabled="!noteName" class="mr-2 flex-shrink-0"> Create note </Button>
  </form>
</template>
