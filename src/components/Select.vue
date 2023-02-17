<script lang="ts">
import { defineComponent } from 'vue'
import { computedInject, useVModel } from '@vueuse/core'
import { computed } from '#imports'

export default defineComponent({
  props: {
    value: {
      type: [String, Number, Boolean, Object, Array, Function],
      default: '',
    },
    id: { type: String, default: null },
    placeholder: { type: String, default: null },
  },
  emits: ['update:value', 'change', 'focus', 'blur'],
  setup(props, { emit }) {
    const newValue = useVModel(props, 'value', emit)
    const labelFor = computedInject('labelFor', source => source, '')
    const newId = computed(() => props.id || labelFor.value)

    return {
      newId,
      newValue,
    }
  },
})
</script>

<template>
  <select
    :id="newId"
    v-model="newValue"
    class="select bg-white color-black rounded w-full px-2 block h-8 focus:ring-indigo-500 focus:border-indigo-500"
  >
    <template v-if="placeholder">
      <option :value="null" disabled hidden>
        {{ placeholder }}
      </option>
    </template>

    <slot />
  </select>
</template>
