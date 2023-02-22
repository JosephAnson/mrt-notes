<script lang="ts" setup>
import type { Note } from '~/types'
const props = defineProps<{
  note: Note
}>()

const user = useSupabaseUser()

const isUsers = isUsersNote(user.value?.id, props.note.user_id)
const formattedDate = useDateFormat(props.note.created_at, 'YYYY-MM-DD')
</script>

<template>
  <div class="flex justify-between w-full bg-gray-800 py-1 px-2 rounded mb-2">
    <div class="mr-4">
      <Heading h4 class="line-clamp-3">
        {{ props.note.name }}
      </Heading>
      <div class="flex items-center pb-2">
        <span class="i-carbon-user inline-block" /> {{ props.note.username }}
        <span
          class="border-r-1 border-solid h-4 border-white pr-2 mr-2 inline-block"
        ></span>
        Created on: {{ formattedDate }}
      </div>
      <Field
        v-if="props.note.description"
        stacked
        class="line-clamp-3 border-t-1 border-solid border-white pt-2"
      >
        <p>{{ props.note.description }}</p>
      </Field>
    </div>
    <div class="flex">
      <NuxtLink
        v-if="isUsers"
        :to="`/note/edit/${props.note.id}`"
        class="mr-2 mb-2 inline-block"
      >
        <Button>Edit</Button>
      </NuxtLink>

      <NuxtLink :to="`/note/${props.note.id}`" class="mr-2 mb-2 inline-block">
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
