<script setup lang="ts">
const noteName = ref('')
</script>

<template>
  <Heading h3> Create New Note </Heading>
  <form class="flex" @submit.prevent="createNewNote(noteName)">
    <Field sr-only label="Enter name for note" class="w-full" label-for="create-note">
      <Input v-model="noteName" class="mr-2" placeholder="Enter name for note" />
    </Field>
    <Button type="submit" :disabled="!noteName" class="mr-2 flex-shrink-0"> Create note </Button>
  </form>
</template>
