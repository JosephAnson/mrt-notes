<script setup lang="ts">
import type { HTMLAttributes, PropType } from 'vue'

const props = defineProps({
  h1: {
    type: Boolean,
    default: false,
  },
  h2: {
    type: Boolean,
    default: false,
  },
  h4: {
    type: Boolean,
    default: false,
  },
  p: {
    type: Boolean,
    default: false,
  },
  bold: {
    type: Boolean,
    default: false,
  },
  styled: {
    type: String as PropType<HeadingSizesType | null>,
    default: null,
  },
  class: {
    type: String as PropType<HTMLAttributes['class']>,
  },
})

type HeadingSizesType = 'h1' | 'h2' | 'h3' | 'h4' | 'p'

const type = computed(() => {
  if (props.h1) return 'h1'
  if (props.h2) return 'h2'
  if (props.h4) return 'h4'
  if (props.p) return 'p'

  return 'h3'
})

function getHeaderClass(type: HeadingSizesType) {
  switch (type) {
    case 'h1':
      return 'text-2xl md:text-3xl mb-5'
    case 'h2':
      return 'text-xl md:text-2xl mb-4'
    case 'h4':
      return 'md:text-l mb-2'
    case 'p':
      return 'text-base'
    default:
      return 'text-xl md:text-xl mb-3'
  }
}

const styles = computed(() => {
  if (!props.styled) return getHeaderClass(type.value)
  return getHeaderClass(props.styled)
})
</script>

<template>
  <component :is="type" :class="cn('heading font-secondary font-semibold', [styles, { 'font-bold': bold }], props.class)">
    <slot />
  </component>
</template>
