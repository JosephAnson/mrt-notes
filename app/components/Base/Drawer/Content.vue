<script lang="ts" setup>
import type { DialogContentEmits, DialogContentProps } from 'radix-vue'
import type { HtmlHTMLAttributes } from 'vue'
import { useForwardPropsEmits } from 'radix-vue'
import { DrawerContent, DrawerPortal } from 'vaul-vue'
import DrawerOverlay from './Overlay.vue'

const props = defineProps<DialogContentProps & { class?: HtmlHTMLAttributes['class'] }>()
const emits = defineEmits<DialogContentEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent
      v-bind="forwarded" class="fixed p-2 inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background" :class="[
        props.class,
      ]"
    >
      <div class="mx-auto mt-2 sm:mt-4 h-2 w-[100px] rounded-full bg-muted" />
      <slot />
    </DrawerContent>
  </DrawerPortal>
</template>
