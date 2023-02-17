<script lang="ts">
import type { PropType } from 'vue'

import { onClickOutside } from '@vueuse/core'
import { getValueByPath, toCss } from '~/utils/helpers'

interface AutocompleteState {
  selected: string | Record<string, any> | null
  hovered: any
  isActive: boolean
  newValue: number | string | undefined
  newAutocomplete: string
  isListInViewportVertically: boolean
  hasFocus: boolean
  style: Record<string, any>
}

export default defineComponent({
  name: 'Autocomplete',
  inheritAttrs: false,
  props: {
    value: { type: [Number, String], default: undefined },
    size: { type: String, default: undefined },
    expanded: Boolean,
    loading: Boolean,
    rounded: Boolean,
    icon: { type: String, default: undefined },
    autocomplete: { type: String, default: () => 'on' },
    maxlength: { type: [Number, String], default: undefined },
    data: { type: Array as PropType<Record<string, any>[]>, default: () => [] },
    field: { type: String, default: 'value' },
    keepFirst: Boolean,
    clearOnSelect: Boolean,
    openOnFocus: Boolean,
    checkInfiniteScroll: Boolean,
    keepOpen: Boolean,
    clearable: Boolean,
    maxHeight: { type: [String, Number], default: undefined },
    dropdownPosition: { type: String, default: 'auto' },
    groupField: { type: String, default: undefined },
    groupOptions: { type: String, default: undefined },
    iconRight: { type: String, default: undefined },
    iconRightClickable: Boolean,
  },
  emits: [
    'update:value',
    'update:vue',
    'iconClick',
    'focus',
    'blur',
    'typing',
    'select', 'iconRightClick',
  ],
  setup(props, { emit, slots }) {
    const input = ref<HTMLElement | null>(null)
    const dropdown = ref<HTMLElement | null>(null)

    const autocompleteState = reactive<AutocompleteState>({
      selected: null,
      hovered: null,
      isActive: false,
      newValue: props.value,
      newAutocomplete: props.autocomplete || 'off',
      isListInViewportVertically: true,
      hasFocus: false,
      style: {},
    })

    const computedData = computed(() => {
      if (props.groupField) {
        if (props.groupOptions) {
          const newData: any[] = []
          props.data.forEach((option) => {
            const group = getValueByPath(option, props.groupField)
            const items = getValueByPath(option, props.groupOptions)
            newData.push({ group, items })
          })
          return newData
        }
        else {
          const tmp: Record<string, any> = {}
          props.data.forEach((option) => {
            const group = getValueByPath(option, props.groupField)
            if (!tmp[group])
              tmp[group] = []

            tmp[group].push(option)
          })
          const newData: any[] = []
          Object.keys(tmp).forEach((group) => {
            newData.push({ group, items: tmp[group] })
          })
          return newData
        }
      }
      return [{ items: props.data }]
    })

    const isEmpty = computed(() => {
      if (!computedData.value)
        return true

      return !computedData.value.some((element: any) => element.items && element.items.length)
    })

    /**
     * Check if exists default slot
     */
    const hasDefaultSlot = computed(() => {
      return !!slots.default
    })

    /**
     * Check if exists group slot
     */
    const hasGroupSlot = computed(() => {
      return !!slots.group
    })

    /**
     * Check if exists "empty" slot
     */
    const hasEmptySlot = computed(() => {
      return !!slots.empty
    })

    /**
     * Check if exists "header" slot
     */
    const hasHeaderSlot = computed(() => {
      return !!slots.header
    })

    /**
     * Check if exists "footer" slot
     */
    const hasFooterSlot = computed(() => {
      return !!slots.footer
    })

    /**
     * Apply dropdownPosition property
     */
    const isOpenedTop = computed(() => {
      return (
        props.dropdownPosition === 'top'
        || (props.dropdownPosition === 'auto' && !autocompleteState.isListInViewportVertically)
      )
    })

    const newIconRight = computed(() => {
      if (props.clearable && autocompleteState.newValue)
        return 'cancel'

      return props.iconRight
    })

    const newIconRightClickable = computed(() => {
      if (props.clearable)
        return true

      return props.iconRightClickable
    })

    const contentStyle = computed(() => {
      return {
        maxHeight: toCss(props.maxHeight),
      }
    })

    /**
     * When dropdown is toggled, check the visibility to know when
     * to open upwards.
     */
    watch(
      () => autocompleteState.isActive,
      (active: boolean) => {
        if (props.dropdownPosition === 'auto') {
          if (active) {
            calcDropdownInViewportVertical()
          }
          else {
            // Timeout to wait for the animation to finish before recalculating
            setTimeout(() => {
              calcDropdownInViewportVertical()
            }, 100)
          }
        }
      },
    )

    /**
     * When updating input's value
     *   1. Emit changes
     *   2. If value isn't the same as selected, set null
     *   3. Close dropdown if value is clear or else open it
     */
    watch(
      () => autocompleteState.newValue,
      (value: number | string | undefined) => {
        emit('update:value', value)

        // Check if selected is invalid
        const currentValue = getValue(autocompleteState.selected)
        if (currentValue && currentValue !== value)
          setSelected(null, false)

        // Close dropdown if input is clear or else open it
        if (autocompleteState.hasFocus && (!props.openOnFocus || value))
          autocompleteState.isActive = !!value
      },
    )

    /**
     * When v-model is changed:
     *   1. Update internal value.
     *   2. If it's invalid, validate again.
     */
    watch(
      () => props.value,
      (value: number | string | undefined) => {
        autocompleteState.newValue = value
      },
    )

    /**
     * Select first option if "keep-first
     */
    watch(
      () => props.data,
      () => {
        // Keep first option always pre-selected
        if (props.keepFirst)
          selectFirstOption(computedData.value)
      },
      { deep: true },
    )

    /**
     * Set which option is currently hovered.
     */
    function setHovered(option: any) {
      if (!option)
        return

      autocompleteState.hovered = option
    }

    /**
     * Set which option is currently selected, update v-model,
     * update input value and close dropdown.
     */
    function setSelected(
      option?: string | Record<string, any> | null,
      closeDropdown = true,
      event = undefined,
    ) {
      if (option === undefined)
        return

      autocompleteState.selected = option
      emit('select', autocompleteState.selected, event)
      if (autocompleteState.selected !== null) {
        autocompleteState.newValue = props.clearOnSelect
          ? ''
          : getValue(autocompleteState.selected)
        setHovered(null)
      }
      closeDropdown
        && nextTick(() => {
          autocompleteState.isActive = false
        })
    }

    /**
     * Select first option
     */
    function selectFirstOption(element: any) {
      nextTick(() => {
        if (element.length) {
          // If has visible data or open on focus, keep updating the hovered
          const option = element[0].items[0]
          if (
            props.openOnFocus
            || (autocompleteState.newValue !== '' && autocompleteState.hovered !== option)
          )
            setHovered(option)
        }
        else {
          setHovered(null)
        }
      })
    }

    /**
     * Enter key listener.
     * Select the hovered option.
     */
    function enterPressed(event: any) {
      if (autocompleteState.hovered === null)
        return

      setSelected(autocompleteState.hovered, !props.keepOpen, event)
    }

    /**
     * Tab key listener.
     * Select hovered option if it exists, close dropdown, then allow
     * native handling to move to next tabbable element.
     */
    function tabPressed(event: any) {
      if (autocompleteState.hovered === null) {
        autocompleteState.isActive = false
        return
      }
      setSelected(autocompleteState.hovered, !props.keepOpen, event)
    }

    /**
     * Close dropdown if clicked outside.
     */
    onClickOutside(dropdown, () => {
      if (!autocompleteState.hasFocus)
        autocompleteState.isActive = false
    })

    /**
     * Return display text for the input.
     * If object, get value from path, or else just the value.
     */
    function getValue(option: string | Record<string, any> | null) {
      if (option === null)
        return

      return typeof option === 'object' ? getValueByPath(option, props.field) : option
    }

    /**
     * Calculate if the dropdown is vertically visible when activated,
     * otherwise it is openened upwards.
     */
    function calcDropdownInViewportVertical() {
      nextTick(() => {
        /**
         * dropdown.value may be null
         * when Autocomplete is conditional rendered
         */
        if (dropdown.value === null)
          return

        const rect = dropdown.value.getBoundingClientRect()

        autocompleteState.isListInViewportVertically
          = rect.top >= 0
          && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      })
    }

    /**
     * Arrows keys listener.
     * If dropdown is active, set hovered option, or else just open.
     */
    function keyArrows(direction: string) {
      const sum = direction === 'down' ? 1 : -1
      if (autocompleteState.isActive) {
        const data = computedData.value.map((d: any) => d.items).reduce((a, b) => [...a, ...b], [])
        let index = data.indexOf(autocompleteState.hovered) + sum
        index = index > data.length - 1 ? data.length - 1 : index
        index = index < 0 ? 0 : index

        setHovered(data[index])

        const list = dropdown.value && dropdown.value.querySelector('.dropdown-content')
        if (!list)
          return

        const element = list.querySelectorAll('a.dropdown-item:not(.is-disabled)')[
          index
        ] as HTMLElement
        if (!element)
          return

        const visMin = list.scrollTop
        const visMax = list.scrollTop + list.clientHeight - element.clientHeight

        if (element.offsetTop < visMin)
          list.scrollTop = element.offsetTop
        else if (element.offsetTop >= visMax)
          list.scrollTop = element.offsetTop - list.clientHeight + element.clientHeight
      }
      else {
        autocompleteState.isActive = true
      }
    }

    /**
     * Focus listener.
     * If value is the same as selected, select all text.
     */
    function focused(event: any) {
      if (props.openOnFocus) {
        autocompleteState.isActive = true
        if (props.keepFirst)
          selectFirstOption(computedData.value)
      }
      autocompleteState.hasFocus = true
      emit('focus', event)
    }

    /**
     * Blur listener.
     */
    function onBlur(event: any) {
      autocompleteState.hasFocus = false
      autocompleteState.isActive = false
      emit('blur', event)
    }

    function onInput() {
      const currentValue = getValue(autocompleteState.selected)
      if (currentValue && currentValue === autocompleteState.newValue)
        return

      emit('typing', autocompleteState.newValue)
    }

    function rightIconClick(event: any) {
      if (props.clearable) {
        autocompleteState.newValue = ''
        setSelected(null, false)
      }
      else {
        emit('iconRightClick', event)
      }
    }

    if (typeof window !== 'undefined') {
      if (props.dropdownPosition === 'auto')
        window.addEventListener('resize', calcDropdownInViewportVertical)
    }

    onBeforeUnmount(() => {
      if (typeof window !== 'undefined') {
        if (props.dropdownPosition === 'auto')
          window.removeEventListener('resize', calcDropdownInViewportVertical)
      }
    })

    return {
      autocompleteState,
      newIconRight,
      newIconRightClickable,
      hasDefaultSlot,
      hasEmptySlot,
      hasHeaderSlot,
      hasGroupSlot,
      hasFooterSlot,
      isOpenedTop,
      contentStyle,
      computedData,
      isEmpty,
      dropdown,
      input,
      getValue,
      onInput,
      focused,
      onBlur,
      tabPressed,
      enterPressed,
      keyArrows,
      rightIconClick,
      setSelected,
    }
  },
})
</script>

<template>
  <div ref="root" class="autocomplete control" :class="{ 'is-expanded': expanded }">
    <Input
      v-bind="$attrs"
      ref="input"
      v-model:value="autocompleteState.newValue"
      type="text"
      :size="size"
      :loading="loading"
      :rounded="rounded"
      :icon="icon"
      :icon-right="newIconRight"
      :icon-right-clickable="newIconRightClickable"
      :maxlength="maxlength"
      :autocomplete="autocompleteState.newAutocomplete"
      @update:value="onInput"
      @focus="focused"
      @blur="onBlur"
      @keyup.esc.prevent="autocompleteState.isActive = false"
      @keydown.tab="tabPressed"
      @keydown.enter.prevent="enterPressed"
      @keydown.up.prevent="keyArrows('up')"
      @keydown.down.prevent="keyArrows('down')"
      @icon-right-click="rightIconClick"
      @icon-click="(event) => $emit('iconClick', event)"
    />

    <transition name="fade">
      <div
        v-show="autocompleteState.isActive && (!isEmpty || hasEmptySlot || hasHeaderSlot)"
        ref="dropdown"
        class="dropdown-menu"
        :class="{ 'is-opened-top': isOpenedTop }"
        :style="autocompleteState.style"
      >
        <div v-show="autocompleteState.isActive" class="dropdown-content" :style="contentStyle">
          <div v-if="hasHeaderSlot" class="dropdown-item">
            <slot name="header" />
          </div>
          <template v-for="(element, groupindex) in computedData" :key="`${groupindex}group`">
            <div v-if="element.group" class="dropdown-item">
              <slot v-if="hasGroupSlot" name="group" :group="element.group" :index="groupindex" />
              <span v-else class="has-text-weight-bold">
                {{ element.group }}
              </span>
            </div>
            <a
              v-for="(option, index) in element.items"
              :key="`${groupindex}:${index}`"
              class="dropdown-item"
              :class="{ 'is-hovered': option === autocompleteState.hovered }"
              @click="setSelected(option, undefined, $event)"
            >
              <slot v-if="hasDefaultSlot" :option="option" :index="index" />
              <span v-else>
                {{ getValue(option, true) }}
              </span>
            </a>
          </template>
          <div v-if="isEmpty && hasEmptySlot" class="dropdown-item is-disabled">
            <slot name="empty" />
          </div>
          <div v-if="hasFooterSlot" class="dropdown-item">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
