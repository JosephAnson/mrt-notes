<script setup lang="ts">
import type { TabsListProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { TabsList } from 'radix-vue'
import { computed } from 'vue'

const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <TabsList
    v-bind="delegatedProps"
    class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
    :class="props.class"
  >
    <slot />
  </TabsList>
</template>
