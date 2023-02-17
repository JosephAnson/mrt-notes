<script lang="ts">
import { useVModel } from '@vueuse/core'
import { fieldMessage, fieldType } from '~/shared/form-helpers'

export default defineComponent({
  props: {
    value: { type: [Number, String], default: '' },
    id: { type: String, default: null },
    size: { type: String, default: null },
    role: String,
    expanded: Boolean,
    loading: Boolean,
    disabled: Boolean,
    rounded: Boolean,
    icon: { type: String, default: null },
    autocomplete: { type: String, default: 'on' },
    maxlength: { type: [Number, String], default: null },
    min: { type: [Number, String], default: null },
    max: { type: [Number, String], default: null },
    type: { type: String, default: 'text' },
    passwordReveal: { type: Boolean, default: false },
    iconClickable: Boolean,
    hasCounter: Boolean,
    customClass: { type: String, default: '' },
    iconRight: { type: String, default: null },
    iconRightClickable: Boolean,
    inputStyle: { type: String, default: null },
  },
  emits: ['blur', 'input', 'update:value', 'focus', 'input', 'icon-right-click'],
  setup(props, { emit }) {
    const input = ref<HTMLElement | null>(null)
    const textarea = ref<HTMLElement | null>(null)

    const _elementRef = props.type === 'textarea' ? textarea : input

    const newValue = useVModel(props, 'value', emit, { passive: true })

    const inputState = reactive({
      newType: props.type,
      newAutocomplete: props.autocomplete,
      isPasswordVisible: false,
      isFocused: false,
    })

    const rootClasses = computed(() => {
      return [
        iconPosition.value,
        props.size,
        {
          'is-expanded': props.expanded,
          'is-loading': props.loading,
          'is-clearfix': !hasMessage.value,
        },
      ]
    })

    /**
     * Get the type prop from parent if it's a Field.
     */
    const statusType = computed(() => fieldType())

    const inputClasses = computed(() => [
      statusType.value,
      props.size,
      { 'is-rounded': props.rounded },
    ])

    const iconSize = computed(() => props.size)

    const hasIconRight = computed(() => {
      return props.passwordReveal || props.loading || statusTypeIcon.value || props.iconRight
    })

    const rightIcon = computed(() => {
      if (props.passwordReveal)
        return passwordVisibleIcon.value
      else if (props.iconRight)
        return props.iconRight

      return statusTypeIcon.value
    })

    const rightIconType = computed(() => {
      if (props.passwordReveal)
        return 'is-primary'
      else if (props.iconRight)
        return null

      return statusType.value
    })

    /**
     * Position of the icon or if it's both sides.
     */
    const iconPosition = computed(() => {
      if (props.icon && hasIconRight.value)
        return 'has-icons-left has-icons-right'
      else if (!props.icon && hasIconRight.value)
        return 'has-icons-right'
      else if (props.icon)
        return 'has-icons-left'

      return ''
    })

    /**
     * Icon name (MDI) based on the type.
     */
    const statusTypeIcon = computed(() => {
      switch (statusType.value) {
        case 'is-success':
          return 'success'
        case 'is-danger':
          return 'alert'
        case 'is-info':
          return 'info'
        case 'is-warning':
          return 'help'
      }
      return ''
    })

    /**
     * Check if have any message prop from parent if it's a Field.
     */
    const hasMessage = computed(() => {
      return !!fieldMessage
    })

    /**
     * Current password-reveal icon name.
     */
    const passwordVisibleIcon = computed(() => {
      return !inputState.isPasswordVisible ? 'visibility' : 'visibility-off'
    })

    /**
     * Get value length
     */
    const valueLength = computed(() => newValue.value.toString().length)

    /**
     * if counter should show
     */
    const showCounter = computed(() => {
      return props.maxlength && props.hasCounter && props.type !== 'number'
    })

    function onInput($event: InputEvent): void {
      const value: string = ($event.target as HTMLInputElement).value
      newValue.value = value
      emit('update:value', value)
    }

    function onBlur($event?: Event): void {
      inputState.isFocused = false
      newValue.value = minMaxCheck(newValue.value)

      emit('blur', $event)
    }

    function onFocus($event?: Event): void {
      inputState.isFocused = true

      emit('focus', $event)
    }

    function minMaxCheck(value: number | string) {
      if (value) {
        if (props.type === 'number') {
          const valueNum = typeof value === 'string' ? parseInt(value) : value

          if (props.max) {
            if (valueNum >= props.max)
              value = props.max
          }

          if (props.min) {
            if (valueNum <= props.min)
              value = props.min
          }
        }
      }

      return value
    }

    /**
     * Toggle the visibility of a password-reveal input
     * by changing the type and focus the input right away.
     */
    function togglePasswordVisibility() {
      inputState.isPasswordVisible = !inputState.isPasswordVisible
      inputState.newType = inputState.isPasswordVisible ? 'text' : 'password'

      nextTick(() => {
        _elementRef.value && _elementRef.value.focus()
      })
    }

    function iconClick(emitName: any, event: any) {
      emit(emitName, event)
      nextTick(() => {
        _elementRef.value && _elementRef.value.focus()
      })
    }

    function rightIconClick(event: any) {
      if (props.passwordReveal)
        togglePasswordVisibility()
      else if (props.iconRightClickable)
        iconClick('icon-right-click', event)
    }

    return {
      input,
      textarea,
      newValue,
      inputState,
      rootClasses,
      inputClasses,
      iconSize,
      hasIconRight,
      rightIcon,
      rightIconType,
      showCounter,
      valueLength,
      rightIconClick,
      onInput,
      onBlur,
      onFocus,
      iconClick,
    }
  },
})
</script>

<template>
  <div class="control" :class="rootClasses" role="input-element">
    <input
      v-if="type !== 'textarea'"
      v-bind="$attrs"
      :id="id"
      ref="input"
      v-model="newValue"
      :role="role"
      :autocomplete="inputState.newAutocomplete"
      :class="[inputClasses, customClass]"
      :style="inputStyle"
      :max="max"
      :maxlength="maxlength"
      :min="min"
      :type="inputState.newType"
      :disabled="disabled ? true : null"
      class="input"
      @input="onInput"
      @blur="onBlur"
      @focus="onFocus"
    >

    <textarea
      v-else
      v-bind="$attrs"
      :id="id"
      ref="textarea"
      v-model="newValue"
      :role="role"
      :class="[inputClasses, customClass]"
      :style="inputStyle"
      :maxlength="maxlength"
      :disabled="disabled ? true : null"
      class="textarea"
      @input="onInput"
      @blur="onBlur"
      @focus="onFocus"
    />

    <Icon
      v-if="icon"
      class="is-left"
      :class="{ 'is-clickable': iconClickable }"
      :icon="icon"
      :size="iconSize"
      :disabled="disabled ? true : null"
      data-testid="input-icon-left"
      @click="iconClick('icon-click', $event)"
    />

    <Icon
      v-if="!loading && hasIconRight"
      class="is-right"
      :class="{ 'is-clickable': passwordReveal || iconRightClickable }"
      :icon="rightIcon"
      :size="iconSize"
      :type="rightIconType"
      :disabled="disabled ? true : null"
      both
      data-testid="input-icon-right"
      @click="rightIconClick"
    />

    <small v-if="showCounter" class="help counter"> {{ valueLength }} / {{ maxlength }} </small>
  </div>
</template>
