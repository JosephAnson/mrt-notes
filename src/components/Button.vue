<script lang="ts" setup>
const props = defineProps({
  tag: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <component
    :is="props.tag"
    class="bg-primary-100 hover:bg-primary-400 text-white font-bold py-1 px-6 rounded h-8 focus:ring-indigo-500 focus:border-indigo-500 whitespace-nowrap"
    :class="{ 'bg-primary-500 cursor-not-allowed': props.disabled }"
  >
    <slot />
  </component>
</template>
