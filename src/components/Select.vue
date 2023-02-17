<script lang="ts">
import { defineComponent } from 'vue'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  props: {
    value: {
      type: [String, Number, Boolean, Object, Array, Function],
      default: '',
    },
    id: { type: String, default: null },
    placeholder: { type: String, default: null },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const newValue = useVModel(props, 'value', emit, { passive: true })

    return {
      newValue,
    }
  },
})
</script>

<template>
  <select
    :id="id"
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
