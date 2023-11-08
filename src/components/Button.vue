<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    tag?: string
    disabled?: boolean
    to?: string
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    type: 'button',
  },
)
</script>

<template>
  <NuxtLink
    :to="props.to"
    :type="props.type"
    exact-active-class="bg-yellow-500 text-white hover:bg-yellow-600"
    class="bg-primary-100 hover:bg-primary-400 text-white text-center font-bold py-1 px-6 rounded h-8 focus:ring-indigo-500 focus:border-indigo-500 whitespace-nowrap"
    :class="{ 'bg-primary-500 cursor-not-allowed': props.disabled }"
  >
    <slot />
  </NuxtLink>
</template>
