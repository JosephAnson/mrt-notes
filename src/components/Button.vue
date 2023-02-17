<script lang="ts">
export default {
  props: {
    tag: {
      type: String,
      default: 'button',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<template>
  <component
    :is="tag"
    class="bg-primary-100 hover:bg-primary-400 text-white font-bold py-1 px-6 rounded h-8 focus:ring-indigo-500 focus:border-indigo-500"
    :class="{ 'bg-primary-500 cursor-not-allowed': disabled }"
  >
    <slot />
  </component>
</template>
