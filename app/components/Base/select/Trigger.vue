<script setup lang="ts">
import type { VariantProps } from 'class-variance-authority'
import type { SelectTriggerProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { cva } from 'class-variance-authority'
import { ChevronDown } from 'lucide-vue-next'
import { SelectIcon, SelectTrigger, useForwardProps } from 'radix-vue'
import { computed } from 'vue'
import { wowColorsVariants } from '~/utils/config'

const props = defineProps<SelectTriggerProps & {
  class?: HTMLAttributes['class']
  variant?: TriggerVariants['variant']
}>()

type TriggerVariants = VariantProps<typeof triggerVariants>

const triggerVariants = cva(
  'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate text-start',
  {
    variants: {
      variant: {
        default: '',
        ...wowColorsVariants,
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <SelectTrigger
    v-bind="forwardedProps"
    :class="cn(triggerVariants({ variant }), props.class)"
  >
    <slot />
    <SelectIcon as-child>
      <ChevronDown class="w-4 h-4 opacity-50 shrink-0" />
    </SelectIcon>
  </SelectTrigger>
</template>
