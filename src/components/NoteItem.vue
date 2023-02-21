<script lang="ts" setup>
import type { Note } from '~/types'

const props = defineProps<{
  note: Note
  preview: boolean
}>()
</script>

<template>
  <div
    class="flex items-center justify-between w-full bg-gray-800 py-1 px-2 rounded mb-2"
  >
    <p>Name: {{ props.note.name }}</p>

    <div>
      <nuxt-link
        :to="
          props.preview
            ? `/note/${props.note.id}`
            : `/note/edit/${props.note.id}`
        "
        class="mr-2"
      >
        <Button v-if="props.preview">Open</Button>
        <Button v-else>Edit</Button>
      </nuxt-link>

      <Button class="bg-red-700" @click="deleteNote(props.note.id)">
        Delete
      </Button>
    </div>
  </div>
</template>
