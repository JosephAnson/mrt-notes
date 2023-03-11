<script lang="ts" setup async>
import { addFavourite, removeFavourite } from '~/services/favourites'

const props = defineProps<{
  noteId: number
  userId?: string
  favorite: boolean
}>()

const noteStore = useNotesStore()

noteStore.setNoteFavourite(
  props.noteId,
  await getUserHasFavourite(props.noteId, props.userId)
)

const handleClick = () => {
  if (props.userId) {
    if (props.favorite) {
      removeFavourite(props.noteId, props.userId)
      noteStore.setNoteFavourite(props.noteId, false)
    } else {
      addFavourite(props.noteId, props.userId)
      noteStore.setNoteFavourite(props.noteId, true)
    }
  }
}
</script>

<template>
  <button
    class="inline-block text-base"
    :class="props.favorite ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'"
    @click="handleClick"
  />
</template>
