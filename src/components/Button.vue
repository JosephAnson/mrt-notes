<script lang="ts">
export default {
  props: {
    tag: {
      type: String,
      default: 'button',
    },
  },
}
</script>

<template>
  <component
    :is="tag"
    class="bg-primary-100 hover:bg-primary-400 text-white font-bold py-1 px-6 rounded"
  >
    <slot />
  </component>
</template>
