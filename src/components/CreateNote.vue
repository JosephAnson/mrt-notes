<script setup lang="ts">
import { createNewNote } from '~/services/notes'

const noteName = ref('')
</script>

<template>
  <Heading h3>
    Create New Note
  </Heading>
  <div class="mb-8 flex">
    <Input v-model="noteName" class="mr-2" placeholder="Enter name for note" />
    <Button :disabled="!noteName" class="mr-2 flex-shrink-0" @click="createNewNote(noteName)">
      Create note
    </Button>
  </div>
</template>
