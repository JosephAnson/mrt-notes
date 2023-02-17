<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { computedInject, useVModel } from '@vueuse/core'
import type { Guid } from '~/shared/guid'

interface SelectOption {
  id: string | Guid
  label: string
  value: string | boolean
}

interface FieldState {
  newType: string | Record<string, string>
  newMessage: string | string[] | Record<string, string>
  newDescription: string | string[] | Record<string, string>
}

/**
 * Get the type prop from parent if it's a Field.
 */
const fieldStateDefaultValues: FieldState = {
  newDescription: '',
  newMessage: '',
  newType: '',
}
function fieldType(): string | string[] | Record<string, string> | undefined {
  return inject<FieldState>('fieldState', fieldStateDefaultValues)?.newType
}

export default defineComponent({
  props: {
    value: {
      type: [String, Number, Boolean, Object, Array, Function],
      default: '',
    },
    id: { type: String, default: null },
    placeholder: { type: String, default: null },
    multiple: Boolean,
    nativeSize: { type: [String, Number], default: null },
    size: { type: String, default: null },
    expanded: Boolean,
    loading: Boolean,
    rounded: Boolean,
    disabled: Boolean,
    icon: { type: String, default: null },
    options: { type: Array as PropType<SelectOption[]>, default: null },
  },
  emits: ['update:value', 'change', 'focus', 'blur'],
  setup(props, { emit }) {
    const newValue = useVModel(props, 'value', emit)
    const labelFor = computedInject('labelFor', source => source, '')
    const newId = ref(props.id || labelFor)
    const selectState = reactive({
      options: props.options,
    })

    const spanClasses = computed(() => {
      return [
        props.size,
        fieldType(),
        {
          'is-fullwidth': props.expanded,
          'is-loading': props.loading,
          'is-multiple': props.multiple,
          'is-rounded': props.rounded,
          'is-empty': newValue.value === null,
        },
      ]
    })

    watch(
      () => props.options,
      (value) => {
        selectState.options = value
      },
      { deep: true },
    )

    function onChange(event: any) {
      if (event.target) {
        newValue.value = event.target.value
        emit('update:value', event.target.value)
        emit('change', event.target.value)
      }
    }

    function onBlur($event?: Event): void {
      emit('blur', $event)
    }

    function onFocus($event?: Event): void {
      emit('focus', $event)
    }

    return {
      newId,
      selectState,
      newValue,
      spanClasses,
      onChange,
      onFocus,
      onBlur,
    }
  },
})
</script>

<template>
  <div class="control" :class="{ 'is-expanded': expanded, 'has-icons-left': icon }">
    <span class="select" :class="spanClasses">
      <select
        v-bind="$attrs"
        :id="newId"
        ref="select"
        data-testid="select"
        :value="newValue"
        :multiple="multiple"
        :size="nativeSize"
        :disabled="disabled ? true : null"
        @change="onChange"
        @blur="onBlur"
        @focus="onFocus"
      >
        <template v-if="placeholder">
          <option :value="null" disabled hidden>
            {{ placeholder }}
          </option>
        </template>

        <option
          v-for="option in selectState.options"
          :id="option.id"
          :key="option.id"
          :value="option.value"
        >
          {{ option.label }}
        </option>

        <slot />
      </select>
    </span>

    <Icon v-if="icon" class="is-left" :icon="icon" :size="size" />
  </div>
</template>
