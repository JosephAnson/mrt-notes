<script lang="ts">
export default defineComponent({
  props: {
    modelValue: { type: [Number, String], default: '' },
    id: { type: String, default: null },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const input = useVModel(props, 'modelValue', emit)

    return {
      input,
    }
  },
})
</script>

<template>
  <input
    :id="id"
    v-model="input"
    :type="type"
    :placeholder="placeholder"
    class="bg-white color-black rounded w-full px-2 block h-8 focus:ring-indigo-500 focus:border-indigo-500"
    @change="$emit('change')"
  />
</template>
