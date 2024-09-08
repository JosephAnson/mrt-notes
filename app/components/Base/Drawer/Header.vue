<script lang="ts" setup>
import type { HtmlHTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HtmlHTMLAttributes['class']
}>()
</script>

<template>
  <div class="grid gap-2 py-2 px-2 sm:px-4" :class="[props.class]">
    <slot />
  </div>
</template>
