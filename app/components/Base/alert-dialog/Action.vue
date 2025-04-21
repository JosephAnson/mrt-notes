<script setup lang="ts">
import type { AlertDialogActionProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import type { ButtonVariants } from '~/components/Base/button/_index'
import { AlertDialogAction } from 'radix-vue'
import { computed } from 'vue'
import { buttonVariants } from '~/components/Base/button/_index'

const props = defineProps<AlertDialogActionProps & {
  class?: HTMLAttributes['class']
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
}>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <AlertDialogAction v-bind="delegatedProps" :class="cn(buttonVariants({ variant, size }), props.class)">
    <slot />
  </AlertDialogAction>
</template>
