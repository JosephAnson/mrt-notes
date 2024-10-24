<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'radix-vue'

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})

const { $formbricks } = useNuxtApp()

interface Props extends PrimitiveProps {
  class?: HTMLAttributes['class']
}
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="props.class"
    @click.prevent="$formbricks.track('global_feedback_clicked')"
  >
    <slot />
  </Primitive>
</template>
