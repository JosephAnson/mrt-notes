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
  },
)

const emits = defineEmits<{
  (e: 'delete', note: Note): void
}>()

const user = useSupabaseUser()

const format = 'DD MMMM YYYY'
const isUsers = isUsersNote(user.value?.id, props.note.user_id)
const createdOn = useDateFormat(props.note.created_at, format)
const updatedOn = useTimeAgo(props.note.updated_at)

const canEdit = computed(() => isUsers && props.showEdit)

function onDelete() {
  openDialog({
    message: 'Are you sure you want to delete the note?',
    cancelText: 'No',
    confirmText: 'Yes',
    onConfirm: async () => {
      if (props.note) {
        await deleteNote(props.note.id)
        emits('delete', props.note)
      }
    },
  })
}
</script>

<template>
  <div v-if="props.note" class="flex justify-between w-full bg-primary-600 p-4 rounded mb-2">
    <div class="mr-4 flex-1">
      <NuxtLink :to="canEdit ? `/note/edit/${props.note.id}` : `/note/${props.note.id}`">
        <Heading h4 class="line-clamp-3 flex items-center">
          {{ props.note.name }}
        </Heading>
      </NuxtLink>
      <div class="flex flex-col flex-wrap sm:flex-row sm:items-center text-gray-300 text-sm">
        <nuxt-link v-if="props.note.username" class="flex items-center" :to="`/profile/${props.note.username}`">
          <span class="i-carbon-user inline-block mr-1" /> {{ props.note.username }}
        </nuxt-link>
        <span
          v-if="props.note.username"
          class="hidden sm:inline-block border-r-1 border-solid h-4 border-white:25 pr-2 mr-2"
        />
        <span>Created on: {{ createdOn }}</span>
        <span class="hidden sm:inline-block border-r-1 border-solid h-4 border-white:25 pr-2 mr-2" />
        <span>Updated: {{ updatedOn }}</span>
      </div>
      <Field v-if="props.note.description" stacked class="line-clamp-3 pt-2 !mb-0">
        <p>{{ props.note.description }}</p>
      </Field>
    </div>
    <div class="flex flex-col">
      <Button v-if="canEdit" :to="`/note/edit/${props.note.id}`" class="mr-2 mb-2 inline-block w-full">
        Edit
      </Button>

      <Button :to="`/note/${props.note.id}`" class="mr-2 mb-2 inline-block w-full">
        View
      </Button>

      <Button
        v-if="isUsers && props.showDelete"
        class="bg-red-700 !hover:bg-red-800 mb-2"
        @click="onDelete"
      >
        Delete Note
      </Button>
    </div>
  </div>
</template>
