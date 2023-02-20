<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import type { PropType } from 'vue'

import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

interface ModelState {
  isActive: boolean
  savedScrollTop: null | number
  newWidth: string
  animating: boolean
  destroyed: boolean
}

export default defineComponent({
  model: {
    prop: 'active',
    event: 'update:active',
  },
  props: {
    active: { type: Boolean, default: false },
    component: { type: [Object, Function, String], default: null },
    componentProps: {
      type: Object as PropType<Record<string, any>>,
      default: null,
    },
    componentEvents: {
      type: Object as PropType<Record<string, any>>,
      default: null,
    },
    content: { type: [String, Array], default: null },
    programmatic: Boolean,
    props: { type: Object, default: null },
    events: { type: Object, default: null },
    width: {
      type: [String, Number],
      default: 960,
    },
    hasModalCard: { type: Boolean, default: false },
    animation: {
      type: String,
      default: 'zoom-out',
    },
    canCancel: {
      type: [Array, Boolean],
      default: () => {
        return ['escape', 'x', 'outside', 'button']
      },
    },
    onCancel: {
      type: Function as PropType<any>,
      default: () => {
        return null
      },
    },
    scroll: {
      type: String,
      default: 'clip',
      validator: (value: string) => {
        return ['clip', 'keep'].includes(value)
      },
    },
    fullScreen: { type: Boolean, default: false },
    autoFocus: {
      type: Boolean,
      default: true,
    },
    customClass: { type: String, default: null },
    ariaRole: {
      type: String,
      validator: (value: string) => {
        return ['dialog', 'alertdialog'].includes(value)
      },
      default: null,
    },
    ariaModal: { type: Boolean, default: false },
    ariaLabel: {
      type: String,
      validator: (value: string) => {
        return Boolean(value)
      },
      default: null,
    },
    destroyOnHide: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:active', 'afterEnter', 'afterLeave', 'close', 'cancel'],
  setup(props, { emit }) {
    const modal = ref(null)

    const { activate, deactivate } = useFocusTrap(modal, { immediate: true })

    const modelState = reactive<ModelState>({
      isActive: props.active || false,
      savedScrollTop: null,
      newWidth:
        typeof props.width === 'number' ? `${props.width}px` : props.width,
      animating: !props.active,
      destroyed: !props.active,
    })

    const cancelOptions = computed(() => {
      return typeof props.canCancel === 'boolean'
        ? props.canCancel
          ? ['escape', 'x', 'outside', 'button']
          : []
        : props.canCancel
    })

    const showX = computed(() => {
      return cancelOptions.value.includes('x')
    })

    const customStyle = computed(() => {
      if (!props.fullScreen) return { maxWidth: modelState.newWidth }

      return null
    })

    watch(
      () => props.active,
      (value) => {
        modelState.isActive = value
      }
    )

    watch(
      () => modelState.isActive,
      (value) => {
        if (value) modelState.destroyed = false

        // nextTick(() => {
        //   if (value && root.$el && 'focus' in root.$el && props.autoFocus) {
        //     (root.$el as HTMLElement).focus();
        //   }
        // });
      }
    )

    /**
     * Close the Modal if canCancel and call the onCancel prop (function).
     */
    function cancel(method: string) {
      if (!cancelOptions.value.includes(method)) return

      close()
    }

    /**
     * Call the onCancel prop (function).
     * Emit events, and destroy modal if it's programmatic.
     */
    function close() {
      deactivate()
      emit('close')
      emit('update:active', false)

      // Timeout for the animation complete before destroying
      if (props.programmatic) modelState.isActive = false
    }

    /**
     * Keypress event that is bound to the document.
     */
    function keyPress({ key }: KeyboardEvent) {
      if (modelState.isActive && (key === 'Escape' || key === 'Esc'))
        cancel('escape')
    }

    if (typeof window !== 'undefined')
      document.addEventListener('keyup', keyPress)

    onMounted(() => {
      activate()

      if (props.programmatic) modelState.isActive = true
    })

    return {
      modelState,
      customStyle,
      showX,
      close,
      cancel,
    }
  },
})
</script>

<template>
  <teleport to="body">
    <transition name="zoom-out">
      <div
        v-if="!modelState.destroyed"
        v-show="modelState.isActive"
        class="modal"
        :class="[{ 'is-full-screen': fullScreen }, customClass]"
        tabindex="-1"
        :role="ariaRole"
        :aria-label="ariaLabel"
        :aria-modal="ariaModal"
      >
        <div
          class="fixed bg-black opacity-50 h-full w-full top-0 left-0"
          @click="cancel('outside')"
        />
        <div
          class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full justify-center items-center flex"
        >
          <div class="relative w-full h-full max-w-2xl md:h-auto">
            <div class="relative p-4 bg-gray-700 rounded-lg shadow">
              <component
                v-bind="componentProps"
                :is="component"
                v-if="component"
                :can-cancel="canCancel"
                v-on="componentEvents"
                @close="close"
              />
              <template v-else-if="content">
                <div v-html="content" />
              </template>
              <slot v-else :can-cancel="canCancel" :close="close" />
              <Button
                v-if="showX"
                v-show="!modelState.animating"
                class="modal-close is-large"
                @click="cancel('x')"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
