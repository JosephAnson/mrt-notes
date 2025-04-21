<script lang="ts" setup>
import type { DrawerTitleProps } from 'vaul-vue'
import type { HtmlHTMLAttributes } from 'vue'
import { DrawerTitle } from 'vaul-vue'
import { computed } from 'vue'

const props = defineProps<DrawerTitleProps & { class?: HtmlHTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <DrawerTitle v-bind="delegatedProps" class="text-lg font-semibold leading-none tracking-tight" :class="[props.class]">
    <slot />
  </DrawerTitle>
</template>
