<script lang="ts" setup>
import type { Note } from '~/types'
const props = withDefaults(
  defineProps<{
    note: Note
    showDelete?: boolean
    showEdit?: boolean
  }>(),
  {
    showDelete: true,
    showEdit: true,
  }
)

const user = useSupabaseUser()
const notesStore = useNotesStore()

const format = 'DD MMMM YYYY'
const isUsers = isUsersNote(user.value?.id, props.note.user_id)
const createdOn = useDateFormat(props.note.created_at, format)
const updatedOn = useDateFormat(props.note.updated_at, format)

const canEdit = computed(() => isUsers && props.showEdit)
</script>

<template>
  <div v-if="props.note" class="flex justify-between w-full bg-gray-800 p-4 rounded mb-2">
    <div class="mr-4 flex-1">
      <NuxtLink :to="canEdit ? `/note/edit/${props.note.id}` : `/note/${props.note.id}`">
        <Heading h4 class="line-clamp-3 flex items-center">
          {{ props.note.name }}
        </Heading>
      </NuxtLink>
      <div class="flex flex-col sm:flex-row sm:items-center text-gray-300 text-sm">
        <nuxt-link v-if="props.note.username" :to="`/profile/${props.note.username}`">
          <span class="i-carbon-user inline-block" /> {{ props.note.username }}
        </nuxt-link>
        <span
          v-if="props.note.username"
          class="hidden sm:inline-block border-r-1 border-solid h-4 border-white pr-2 mr-2"
        ></span>
        <span>Created on: {{ createdOn }}</span>
        <span class="hidden sm:inline-block border-r-1 border-solid h-4 border-white pr-2 mr-2"></span>
        <span>Updated: {{ updatedOn }}</span>
        <span v-if="user" class="hidden sm:inline-block border-r-1 border-solid h-4 border-white pr-2 mr-2"></span>
        <FavouriteButton v-if="user" :note-id="props.note.id" class="mt-2 sm:mt-0" />
      </div>
      <Field v-if="props.note.description" stacked class="line-clamp-3 pt-2 !mb-0">
        <p>{{ props.note.description }}</p>
      </Field>
    </div>
    <div class="flex flex-col">
      <NuxtLink v-if="canEdit" :to="`/note/edit/${props.note.id}`" class="mr-2 mb-2 inline-block w-full">
        <Button class="w-full">Edit</Button>
      </NuxtLink>

      <NuxtLink :to="`/note/${props.note.id}`" class="mr-2 mb-2 inline-block w-full">
        <Button class="w-full">View</Button>
      </NuxtLink>

      <Button v-if="isUsers && props.showDelete" class="bg-red-700" @click="notesStore.deleteNote(props.note.id)">
        Delete Note
      </Button>
    </div>
  </div>
</template>
