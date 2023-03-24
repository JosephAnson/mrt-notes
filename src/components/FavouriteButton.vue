<script lang="ts" setup async>
import { useUserStore } from '~/store/user'

const props = defineProps<{ noteId: number; count: number }>()

const userStore = useUserStore()
const user = useSupabaseUser()

const hasFavourite = computed(() => userStore.hasFavourite(props.noteId))
</script>

<template>
  <Tooltip :disabled="!user" :label="hasFavourite ? 'Remove from favourite notes' : 'Add to favourite notes'">
    <button class="flex items-center">
      {{ props.count }} Favourite{{ props.count === 1 ? '' : 's' }}
      <span
        v-if="user"
        class="inline-block ml-1 color-red-500 text-base"
        :class="hasFavourite ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'"
        @click="userStore.toggleUserFavourite(props.noteId)"
      />
    </button>
  </Tooltip>
</template>
