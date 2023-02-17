<script lang="ts">
import { computedInject, useVModel } from '@vueuse/core'
import { computed, defineComponent } from '#imports'

export default defineComponent({
  props: {
    modelValue: { type: [Number, String], default: '' },
    id: { type: String, default: null },
    type: { type: String, default: 'text' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    console.log('PROPS', props.modelValue)
    const input = useVModel(props, 'modelValue', emit)
    const labelFor = computedInject('labelFor', source => source, '')
    const newId = computed(() => props.id || labelFor.value)

    return {
      input,
      newId,
    }
  },
})
</script>

<template>
  <input
    :id="newId"
    v-model="input"
    :type="type"
    class="bg-white color-black rounded w-full px-2 block h-8 focus:ring-indigo-500 focus:border-indigo-500"
  >
</template>
