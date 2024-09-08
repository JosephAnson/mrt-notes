<script lang="ts" setup>
import { DrawerDescription } from 'vaul-vue'
import { computed, type HtmlHTMLAttributes } from 'vue'
import type { DrawerDescriptionProps } from 'vaul-vue'

const props = defineProps<DrawerDescriptionProps & { class?: HtmlHTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <DrawerDescription v-bind="delegatedProps" class="text-sm text-muted-foreground" :class="[props.class]">
    <slot />
  </DrawerDescription>
</template>
