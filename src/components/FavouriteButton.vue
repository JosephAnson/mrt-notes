<script lang="ts" setup async>
import { useUserStore } from '~/store/user'

const props = defineProps<{ noteId: number }>()
const userStore = useUserStore()
</script>

<template>
  <button
    class="inline-block text-base"
    :class="userStore.hasFavourite(props.noteId) ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'"
    @click="userStore.toggleUserFavourite(props.noteId)"
  />
</template>
