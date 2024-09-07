<script setup lang='ts'>
import type { HTMLAttributes } from 'vue'
import type { CardVariants } from '~/components/Base/card/_index'

defineProps<{
  variant?: CardVariants['variant']
  title?: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <BaseCard :variant="variant">
    <BaseCardBlock class-name="pb-3">
      <BaseCardTitle v-if="title">
        {{ title }}
      </BaseCardTitle>
      <BaseCardDescription>
        <slot />
      </BaseCardDescription>
    </BaseCardBlock>
  </BaseCard>
</template>
