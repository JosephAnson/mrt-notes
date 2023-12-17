<script lang="ts">
import { defineComponent, provide } from 'vue'

export default defineComponent({
  props: {
    label: { type: String, default: null },
    stacked: { type: Boolean, default: false },
    labelFor: { type: String, required: false },
    srOnly: { type: Boolean, default: false },
  },
  setup(props) {
    provide('labelFor', props.labelFor)
  },
})
</script>

<template>
  <div class="field items-center mb-4 :not(:last-child):mb-2" :class="{ flex: !stacked }">
    <label v-if="label" :for="labelFor" class="label mr-4 inline-block" :class="{ 'mb-2': stacked, 'sr-only': srOnly }">
      {{ label }}
    </label>
    <slot />
  </div>
</template>

<style>
.field:last-child {
  margin-bottom: 0 !important;
}
</style>
