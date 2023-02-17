<script lang="ts">
import { computed, defineComponent, nextTick, reactive, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { getValueByPath } from '~/utils/helpers'
import { fieldType } from '~/shared/form-helpers'

export default defineComponent({
  props: {
    tags: { type: Array as PropType<string[]>, default: () => [] },
    data: { type: Array as PropType<string[]>, default: () => [] },
    type: { type: String, default: null },
    closeType: { type: String, default: null },
    rounded: { type: Boolean, default: false },
    attached: { type: Boolean, default: false },
    maxtags: { type: [Number, String], default: null },
    hasCounter: { type: Boolean, default: true },
    field: { type: String, default: 'value' },
    autocompleteSearch: Boolean,
    groupField: { type: String, default: null },
    groupOptions: { type: String, default: null },
    nativeAutocomplete: { type: String, default: null },
    openOnFocus: Boolean,
    disabled: Boolean,
    ellipsis: Boolean,
    closable: { type: Boolean, default: true },
    confirmKeys: { type: Array as PropType<string[]>, default: () => ['|', 'Enter'] },
    removeOnKeys: { type: Array as PropType<string[]>, default: () => ['Backspace'] },
    allowNew: Boolean,
    onPasteSeparators: { type: Array as PropType<string[]>, default: () => [','] },
    beforeAdding: { type: Function as PropType<(before: any) => boolean>, default: () => true },
    allowDuplicates: { type: Boolean, default: false },
    checkInfiniteScroll: { type: Boolean, default: false },
    createTag: { type: Function as PropType<(tag: any) => any>, default: (tag: any) => tag },
    appendToBody: Boolean,
    addOnBlur: Boolean,
    size: { type: String, default: null },
    expanded: Boolean,
    loading: Boolean,
    icon: { type: String, default: null },
    autocomplete: { type: String, default: () => 'on' },
    maxlength: { type: [Number, String], default: null },
  },
  emits: ['input', 'update:tags', 'add', 'remove', 'typing', 'focus', 'blur', 'infinite-scroll'],
  setup(props, { emit, slots }) {
    const autocompleteRef = ref<HTMLElement | null>(null)

    const state = reactive({
      tags: props.tags || [],
      newTag: '',
    })

    const isFocused = ref(false)

    const rootClasses = computed(() => {
      return {
        'is-expanded': props.expanded,
      }
    })

    const containerClasses = computed(() => {
      return {
        'is-focused': isFocused.value,
        'is-focusable': hasInput.value,
      }
    })

    const valueLength = computed(() => {
      return state.newTag.trim().length
    })

    const hasDefaultSlot = computed(() => {
      return !!slots.default?.()
    })

    const hasEmptySlot = computed(() => {
      return !!slots.empty
    })

    const hasHeaderSlot = computed(() => {
      return !!slots.header
    })

    const hasFooterSlot = computed(() => {
      return !!slots.footer
    })

    /**
     * Show the input field if a maxtags hasn't been set or reached.
     */
    const hasInput = computed(() => {
      return props.maxtags == null || tagsLength.value < props.maxtags
    })

    const tagsLength = computed(() => {
      return state.tags.length
    })

    /**
     * If Taginput has onPasteSeparators prop,
     * returning new RegExp used to split pasted string.
     */
    const separatorsAsRegExp = computed(() => {
      const sep = props.onPasteSeparators

      return sep.length
        ? new RegExp(
          sep
            .map((s: string) => {
              return s ? s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') : null
            })
            .join('|'),
          'g',
        )
        : null
    })

    /**
     * When v-model is changed set internal value.
     */
    watch(
      () => props.tags,
      (value) => {
        state.tags = value || []
      },
    )

    watch(
      () => hasInput.value,
      () => {
        if (!hasInput.value)
          onBlur()
      },
    )

    function addTag(tag?: string) {
      const tagToAdd = tag || state.newTag.trim()

      if (tagToAdd) {
        if (!props.autocomplete) {
          const reg = separatorsAsRegExp.value
          if (reg && tagToAdd.match(reg)) {
            tagToAdd
              .split(reg)
              .map(t => t.trim())
              .filter(t => t.length !== 0)
              .map(addTag)
            return
          }
        }
        // Add the tag input if it is not blank
        // or previously added (if not allowDuplicates).
        const add = !props.allowDuplicates ? !state.tags.includes(tagToAdd) : true
        if (add && props.beforeAdding(tagToAdd)) {
          state.tags.push(props.createTag(tagToAdd))
          emit('input', state.tags)
          emit('update:tags', state.tags)
          emit('add', tagToAdd)
        }
      }

      state.newTag = ''
    }

    function getNormalizedTagText(tag: string) {
      if (typeof tag === 'object')
        tag = getValueByPath(tag, props.field)

      return `${tag}`
    }

    function customOnBlur(event: Event) {
      // Add tag on-blur if not select only
      if (!props.autocomplete || props.addOnBlur)
        addTag()

      onBlur(event)
    }

    function onSelect(option: string) {
      if (!option)
        return

      addTag(option)
      nextTick(() => {
        state.newTag = ''
      })
    }

    function removeTag(index: number, event?: any) {
      const tag = state.tags.splice(index, 1)[0]
      emit('input', state.tags)
      emit('update:tags', state.tags)
      emit('remove', tag)

      if (event)
        event.stopPropagation()

      if (props.openOnFocus && autocompleteRef.value)
        autocompleteRef.value.focus()

      return tag
    }

    function removeLastTag() {
      if (tagsLength.value > 0)
        removeTag(tagsLength.value - 1)
    }

    function keydown(event: KeyboardEvent) {
      if (props.removeOnKeys.includes(event.key) && !state.newTag.length)
        removeLastTag()

      // Stop if is to accept select only
      if (props.autocompleteSearch && !props.allowNew)
        return

      if (props.confirmKeys.includes(event.key)) {
        event.preventDefault()
        addTag()
      }
    }

    function onTyping(event: any) {
      emit('typing', event.trim())
    }

    function onBlur($event?: Event): void {
      isFocused.value = false
      emit('blur', $event)
    }

    function onFocus($event?: Event): void {
      isFocused.value = true
      emit('focus', $event)
    }

    function emitInfiniteScroll() {
      emit('infinite-scroll')
    }

    const statusType = computed(() => fieldType())

    return {
      rootClasses,
      containerClasses,
      hasInput,
      state,
      valueLength,
      hasHeaderSlot,
      hasDefaultSlot,
      hasEmptySlot,
      hasFooterSlot,
      tagsLength,
      statusType,
      autocompleteRef,
      getNormalizedTagText,
      removeTag,
      onTyping,
      onFocus,
      onBlur,
      onSelect,
      customOnBlur,
      keydown,
      emitInfiniteScroll,
    }
  },
})
</script>

<template>
  <div class="taginput control" :class="rootClasses">
    <div
      class="taginput-container"
      :class="[statusType, size, containerClasses]"
      :disabled="disabled ? true : null"
    >
      <slot name="selected" :tags="state.tags">
        <Tag
          v-for="(tag, index) in state.tags"
          :key="getNormalizedTagText(tag) + index"
          :type="type"
          :close-type="closeType"
          :size="size"
          :rounded="rounded"
          :attached="attached"
          :tabstop="false"
          :disabled="disabled ? true : null"
          :ellipsis="ellipsis"
          :closable="closable"
          :title="ellipsis && getNormalizedTagText(tag)"
          @close="removeTag(index, $event)"
        >
          <slot name="tag" :tag="tag">
            {{ getNormalizedTagText(tag) }}
          </slot>
        </Tag>
      </slot>

      <Autocomplete
        v-if="hasInput"
        v-bind="$attrs"
        ref="autocompleteRef"
        v-model:value="state.newTag"
        :data="data"
        :field="field"
        :icon="icon"
        :maxlength="maxlength"
        :has-counter="false"
        :size="size"
        :disabled="disabled ? true : null"
        :loading="loading"
        :autocomplete="nativeAutocomplete"
        :open-on-focus="openOnFocus"
        :keep-open="openOnFocus"
        :keep-first="!allowNew"
        :group-field="groupField"
        :group-options="groupOptions"
        :check-infinite-scroll="checkInfiniteScroll"
        :append-to-body="appendToBody"
        @typing="onTyping"
        @focus="onFocus"
        @blur="customOnBlur"
        @keydown="keydown"
        @select="onSelect"
      >
        <template v-if="hasHeaderSlot" #header>
          <slot name="header" />
        </template>
        <template v-if="hasDefaultSlot" #default="props">
          <slot :option="props.option" :index="props.index" />
        </template>
        <template v-if="hasEmptySlot" #empty>
          <slot name="empty" />
        </template>
        <template v-if="hasFooterSlot" #footer>
          <slot name="footer" />
        </template>
      </Autocomplete>
    </div>

    <small v-if="hasCounter && (maxtags || maxlength)" class="help counter">
      <template v-if="maxlength && valueLength > 0"> {{ valueLength }} / {{ maxlength }} </template>
      <template v-else-if="maxtags"> {{ tagsLength }} / {{ maxtags }} </template>
    </small>
  </div>
</template>
