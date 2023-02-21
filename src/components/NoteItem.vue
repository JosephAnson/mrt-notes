<script lang="ts" setup>
import type { Note } from '~/types'
const props = defineProps<{
  note: Note
}>()

const user = useSupabaseUser()

const isUsers = isUsersNote(user.value?.id, props.note.user_id)
</script>

<template>
  <div
    class="flex items-center justify-between w-full bg-gray-800 py-1 px-2 rounded mb-2"
  >
    <p>Name: {{ props.note.name }}</p>

    <div>
      <NuxtLink
        v-if="isUsers"
        tag="button"
        :to="`/note/edit/${props.note.id}`"
        class="mr-2"
      >
        <Button>Edit</Button>
      </NuxtLink>

      <NuxtLink :to="`/note/${props.note.id}`" class="mr-2">
        <Button>View</Button>
      </NuxtLink>

      <Button
        v-if="isUsers"
        class="bg-red-700"
        @click="deleteNote(props.note.id)"
      >
        Delete
      </Button>
    </div>
  </div>
</template>
