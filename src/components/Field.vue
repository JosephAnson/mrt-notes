<script lang="ts">
import { defineComponent, provide } from 'vue'
import { Guid } from '~/utils/guid'

export default defineComponent({
  props: {
    label: { type: String, default: null },
    labelFor: { type: String, default: Guid.create() },
  },
  setup(props) {
    provide('labelFor', props.labelFor)
  },
})
</script>

<template>
  <div class="field flex items-center mb-4 last-child:mb-0">
    <label :for="labelFor" class="label mr-4">
      {{ label }}
    </label>
    <slot />
  </div>
</template>
