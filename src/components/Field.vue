<script lang="ts">
import { computed, defineComponent, provide, reactive, watch } from 'vue'
import type { PropType } from 'vue'
import { Guid } from '~/shared/guid'

interface FieldState {
  newType: string | Record<string, string>
  newMessage: string | string[] | Record<string, string>
  newDescription: string | string[] | Record<string, string>
}

export default defineComponent({
  props: {
    type: { type: [String, Object], default: '' },
    label: { type: String, default: null },
    labelFor: { type: String, default: Guid.create() },
    labelNarrow: Boolean,
    description: {
      type: [String, Array, Object] as PropType<string | string[] | Record<string, string>>,
      default: '',
    },
    message: {
      type: [String, Array, Object] as PropType<string | string[] | Record<string, string>>,
      default: null,
    },
    required: Boolean,
    grouped: Boolean,
    addonsVertical: Boolean,
    groupMultiline: Boolean,
    position: { type: String as PropType<string | null | undefined>, default: null },
    expanded: Boolean,
    labelExpanded: Boolean,
    horizontal: Boolean,
    addons: { type: Boolean, default: true },
    customClass: { type: String, default: null },
  },
  setup(props, { slots }) {
    const fieldState = reactive<FieldState>({
      newType: props.type,
      newMessage: props.message,
      newDescription: props.description,
    })

    provide('fieldState', fieldState)
    provide('labelFor', props.labelFor)

    /**
     * Correct Bulma class for the side of the addon or group.
     *
     * This is not kept like the others (is-small, etc.),
     * because since 'has-addons' is set automatically it
     * doesn't make sense to teach users what addons are exactly.
     */
    const newPosition = computed<string>(() => {
      if (props.position === undefined || props.position === null)
        return ''

      const position = props.position.split('-')
      if (position.length < 1)
        return ''

      const prefix = props.grouped ? 'is-grouped-' : 'has-addons-'

      if (props.position)
        return prefix + position[1]

      return ''
    })

    const rootClasses = computed(() => {
      return [
        newPosition.value,
        {
          'is-expanded': props.expanded,
          'has-addons-vertical': props.addonsVertical,
          'is-grouped-multiline': props.groupMultiline,
          'is-horizontal': props.horizontal,
          'has-label-expanded': props.labelExpanded,
        },
      ]
    })

    /**
     * Formatted message in case it's an array
     * (each element is separated by <br> tag)
     */
    function createMessageString(messageData: string | string[] | Record<string, string>) {
      if (typeof messageData === 'string') {
        return messageData
      }
      else {
        const messages = []

        if (Array.isArray(messageData)) {
          messageData.forEach(message => messages.push(message))
        }
        else {
          for (const key in messageData) {
            // Key is the language string, only display if value true
            if (messageData[key])
              messages.push(key)
          }
        }

        return messages.filter(message => (message || false)).join(' <br> ')
      }
    }

    const formattedMessage = computed<string>(() => createMessageString(fieldState.newMessage))
    const formattedDescription = computed<string>(() =>
      createMessageString(fieldState.newDescription),
    )

    /**
     * Set internal type when prop change.
     */
    watch(
      () => props.type,
      (value) => {
        fieldState.newType = value
      },
      { deep: true },
    )

    /**
     * Set internal message when prop change.
     */
    watch(
      () => props.message,
      (value) => {
        fieldState.newMessage = value
      },
      { deep: true },
    )

    watch(
      () => props.description,
      (value) => {
        fieldState.newDescription = value
      },
      { deep: true },
    )

    /**
     * Field has addons if there are more than one slot
     * (element / component) in the Field.
     * Or is grouped when prop is set.
     * Is a method to be called when component re-render.
     */
    function fieldType() {
      if (props.grouped)
        return 'is-grouped'

      let renderedNode = 0

      if (slots.default)
        renderedNode = slots.default().length

      if (renderedNode > 1 && props.addons && !props.horizontal)
        return 'has-addons'
    }

    return {
      rootClasses,
      fieldState,
      formattedMessage,
      formattedDescription,
      fieldType,
    }
  },
})
</script>

<template>
  <div class="field" data-testid="field" :class="[rootClasses, fieldType()]">
    <template v-if="label">
      <div
        v-if="horizontal"
        class="field-label is-normal"
        data-testid="field-label"
        :class="[customClass, { 'is-narrow': labelNarrow }]"
      >
        <label :for="labelFor" :class="customClass" class="label">
          {{ label }} <span v-if="required" class="has-text-danger">*</span>
        </label>
      </div>
      <template v-else>
        <label :for="labelFor" :class="customClass" class="label" data-testid="label">
          {{ label }} <span v-if="required" class="has-text-danger">*</span>
        </label>
      </template>
    </template>
    <FieldBody
      v-if="horizontal"
      :message="fieldState.newMessage ? formattedMessage : ''"
      :description="fieldState.newDescription ? formattedDescription : ''"
      :type="fieldState.newType"
    >
      <slot />
    </FieldBody>
    <template v-else>
      <slot />
    </template>
    <p
      v-if="fieldState.newMessage && !horizontal"
      class="help"
      :class="fieldState.newType"
      v-html="formattedMessage"
    />
    <p v-if="description && !horizontal" class="help" v-html="formattedDescription" />
  </div>
</template>
