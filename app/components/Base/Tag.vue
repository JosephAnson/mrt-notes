<script lang="ts" setup>
import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'vue'

type TagVariants = VariantProps<typeof tagVariants>

const props = defineProps<{
  variant?: TagVariants['variant']
  class?: HTMLAttributes['class']
}>()

const tagVariants = cva(
  'inline-flex py-1 px-2 text-xs justify-center items-center rounded flex-wrap',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'bg-outline text-outline-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        muted: 'bg-muted text-muted-foreground',
        ghost: 'ring-primary ring-2',
      },
    },
    defaultVariants: {
      variant: 'muted',
    },
  },
)
</script>

<template>
  <Primitive :class="cn(tagVariants({ variant }), props.class)">
    <slot />
  </Primitive>
</template>
