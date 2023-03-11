<script lang="ts" setup async>
import { useUserStore } from '~/store/user'

const props = defineProps<{
  noteId: number
  userId?: string
}>()

const userStore = useUserStore()

const hasFavourite = computed(() =>
  userStore.favourites.find((item) => item.note_id === props.noteId)
)

await useAsyncData(
  'userFavourites',
  async () => await userStore.fetchUserFavourites(props.userId)
)

const handleClick = () => {
  if (props.userId) {
    if (hasFavourite.value) {
      userStore.removeUserFavourite(props.noteId, props.userId)
    } else {
      userStore.addUserFavourite(props.noteId, props.userId)
    }
  }
}
</script>

<template>
  <button
    class="inline-block text-base"
    :class="hasFavourite ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'"
    @click="handleClick"
  />
</template>
