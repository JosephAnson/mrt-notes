<script setup lang="ts">
import type { PrimitiveProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { Primitive } from 'radix-vue'

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
      cn('text-xl font-semibold tracking-tight', props.class)
    "
  >
    <slot />
  </Primitive>
</template>
