<script lang="ts">
import { defineComponent, provide } from 'vue'

export default defineComponent({
  props: {
    label: { type: String, default: null },
    labelFor: { type: String, required: false },
    srOnly: { type: Boolean, default: false },
  },
  setup(props) {
    provide('labelFor', props.labelFor)
  },
})
</script>

<template>
  <div class="items-center mb-4 last:mb-0">
    <BaseLabel v-if="label" :for="labelFor" class="label mr-4 inline-block mb-2" :class="{ 'sr-only': srOnly }">
      {{ label }}
    </BaseLabel>
    <slot />
  </div>
</template>
