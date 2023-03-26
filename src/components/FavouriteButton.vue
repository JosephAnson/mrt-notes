<script lang="ts" setup>
const props = defineProps<{ noteId: number; count: number }>()

const userStore = useUserStore()
const user = useSupabaseUser()

const hasFavourite = computed(() => userStore.hasFavourite(props.noteId))
</script>

<template>
  <Tooltip
    v-if="user"
    :disabled="!user"
    :label="hasFavourite ? 'Remove from favourite notes' : 'Add to favourite notes'"
  >
    <Button
      class="flex items-center bg-transparent !hover:bg-red-500"
      @click="userStore.toggleUserFavourite(props.noteId)"
    >
      Favourite
      <span
        v-if="user"
        class="inline-block ml-2 color-white text-base"
        :class="hasFavourite ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'"
      />
    </Button>
  </Tooltip>
</template>
