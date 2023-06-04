<script lang="ts">
export default defineComponent({
  props: {
    modelValue: { type: [Number, String], default: '' },
    id: { type: String, default: null },
    disabled: { type: Boolean, default: null },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const input = useVModel(props, 'modelValue', emit)

    const newID = inject('labelFor', props.id)

    return {
      input,
      newID,
    }
  },
})
</script>

<template>
  <textarea
    v-if="type === 'textarea'"
    :id="newID"
    v-model="input"
    :placeholder="placeholder"
    class="color-black rounded w-full p-2 block focus:ring-indigo-500 focus:border-indigo-500"
    :class="{
      'bg-gray-300 cursor-not-allowed': disabled,
      'bg-white': !disabled,
    }"
    :disabled="disabled"
  />
  <input
    v-else
    :id="newID"
    v-model="input"
    :type="type"
    :placeholder="placeholder"
    class="color-black rounded w-full px-2 block h-8 focus:ring-indigo-500 focus:border-indigo-500"
    :class="{
      'bg-gray-300 cursor-not-allowed': disabled,
      'bg-white': !disabled,
    }"
    :disabled="disabled"
  />
</template>
