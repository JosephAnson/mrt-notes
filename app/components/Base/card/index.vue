<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cardVariants, type CardVariants } from '~/components/Base/card/_index'

const props = defineProps<{
  class?: HTMLAttributes['class']
  variant?: CardVariants['variant']
}>()
</script>

<template>
  <div
    :class="cn(cardVariants({ variant }), props.class)"
  >
    <slot />
  </div>
</template>
