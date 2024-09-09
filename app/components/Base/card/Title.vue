<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'

interface Props extends PrimitiveProps {
  class?: HTMLAttributes['class']
}
const props = withDefaults(defineProps<Props>(), {
  as: 'h3',
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="
      cn('text-2xl font-semibold tracking-tight', props.class)
    "
  >
    <slot />
  </Primitive>
</template>
