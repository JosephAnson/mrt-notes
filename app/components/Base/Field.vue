<script lang="ts" setup>
import { provide } from 'vue'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  label?: string
  labelFor?: string
  srOnly?: boolean
  class?: HTMLAttributes['class']
}>()

provide('labelFor', props.labelFor)
</script>

<template>
  <div :class="cn('items-center mb-4 last:mb-0', props.class)">
    <BaseLabel v-if="label" :for="labelFor" class="label mr-4 inline-block mb-2" :class="{ 'sr-only': srOnly }">
      {{ label }}
    </BaseLabel>
    <slot />
  </div>
</template>
