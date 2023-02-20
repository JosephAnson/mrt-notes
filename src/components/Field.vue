<script lang="ts">
import { defineComponent, provide } from 'vue'
import { Guid } from '~/utils/guid'

export default defineComponent({
  props: {
    label: { type: String, default: null },
    stacked: { type: Boolean, default: false },
    labelFor: { type: String, default: Guid.create() },
  },
  setup(props) {
    provide('labelFor', props.labelFor)
  },
})
</script>

<template>
  <div class="field mb-4 last-child:mb-0" :class="{ 'flex items-center': !stacked }">
    <label v-if="label" :for="labelFor" class="label mr-2" :class="{ 'mb-2': stacked }">
      {{ label }}
    </label>
    <slot />
  </div>
</template>
