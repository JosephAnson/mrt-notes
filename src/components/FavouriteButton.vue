<script lang="ts" setup async>
import { useUserStore } from '~/store/user'

const props = defineProps<{ noteId: number }>()
const userStore = useUserStore()
</script>

<template>
  <button class="flex items-center text-base" @click="userStore.toggleUserFavourite(props.noteId)">
    <slot />
    <span
      class="inline-block ml-1 color-red"
      :class="userStore.hasFavourite(props.noteId) ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'"
    />
  </button>
</template>
