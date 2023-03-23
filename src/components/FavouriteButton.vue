<script lang="ts" setup async>
import { useUserStore } from '~/store/user'

const props = defineProps<{ noteId: number }>()
const userStore = useUserStore()

const hasFavourite = computed(() => userStore.hasFavourite(props.noteId))
</script>

<template>
  <Tooltip :label="hasFavourite ? 'Remove from favourite notes' : 'Add to favourite notes'">
    <button class="flex items-center text-base" @click="userStore.toggleUserFavourite(props.noteId)">
      <slot />
      <span
        class="inline-block ml-1 color-red-500"
        :class="hasFavourite ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'"
      />
    </button>
  </Tooltip>
</template>
