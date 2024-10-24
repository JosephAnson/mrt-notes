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

async function onDelete() {
  if (props.note) {
    await deleteNote(props.note.id)
    emits('delete', props.note)
  }
}
</script>

<template>
  <BaseCard v-if="note" variant="filled">
    <BaseCardBlock>
      <div class="flex justify-between">
        <div class="mr-4 flex-1">
          <NuxtLink :to="canEdit ? `/note/edit/${props.note.id}` : `/note/${props.note.id}`">
            <BaseHeading h4 class="line-clamp-3 flex items-center">
              {{ props.note.name }}
            </BaseHeading>
          </NuxtLink>
          <div class="flex gap-2 gap-y-1 items-center flex-wrap text-gray-300 text-sm">
            <BaseTag as-child>
              <NuxtLink v-if="props.note.username" class="flex items-center" :to="`/profile/${props.note.username}`">
                <Icon name="carbon:user" class="inline-block mr-1" /> {{ props.note.username }}
              </NuxtLink>
            </BaseTag>
            <BaseTag>Created: {{ createdOn }}</BaseTag>
            <BaseTag>Updated: {{ updatedOn }}</BaseTag>
          </div>
          <BaseField v-if="props.note.description" stacked class="line-clamp-3">
            <p>{{ props.note.description }}</p>
          </BaseField>
        </div>
        <div class="flex flex-col gap-2">
          <BaseButton v-if="canEdit" as-child>
            <NuxtLink :to="`/note/edit/${props.note.id}`">
              Edit
            </NuxtLink>
          </BaseButton>

          <BaseButton as-child>
            <NuxtLink :to="`/note/${props.note.id}`">
              View
            </NuxtLink>
          </BaseButton>

          <BaseAlertDialog v-if="isUsers && props.showDelete">
            <BaseAlertDialogTrigger>
              <BaseButton variant="destructive">
                Delete Note
              </BaseButton>
            </BaseAlertDialogTrigger>
            <BaseAlertDialogContent>
              <BaseAlertDialogHeader>
                <BaseAlertDialogTitle>Are you sure you want to delete the note?</BaseAlertDialogTitle>
                <BaseAlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </BaseAlertDialogDescription>
              </BaseAlertDialogHeader>
              <BaseAlertDialogFooter>
                <BaseAlertDialogCancel>Cancel</BaseAlertDialogCancel>
                <BaseAlertDialogAction
                  variant="destructive"
                  @click="onDelete"
                >
                  Delete Note
                </BaseAlertDialogAction>
              </BaseAlertDialogFooter>
            </BaseAlertDialogContent>
          </BaseAlertDialog>
        </div>
      </div>
    </BaseCardBlock>
  </BaseCard>
</template>
