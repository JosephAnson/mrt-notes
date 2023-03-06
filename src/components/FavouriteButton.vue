<script lang="ts" setup async>
const props = defineProps<{
  noteId: number
  userId?: string
}>()

const favourited = ref(false)

const userHasFavourited = await getUserHasFavourited(props.noteId, props.userId)
favourited.value = userHasFavourited

const handleClick = () => {
  handleFavourite(props.noteId, props.userId)
  favourited.value = !favourited.value
}
</script>

<template>
  <button
    class="inline-block text-base"
    :class="favourited ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'"
    @click="handleClick"
  />
</template>
