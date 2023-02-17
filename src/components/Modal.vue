<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
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
    componentProps: { type: Object as PropType<Record<string, any>>, default: null },
    componentEvents: { type: Object as PropType<Record<string, any>>, default: null },
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
      newWidth: typeof props.width === 'number' ? `${props.width}px` : props.width,
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
      if (!props.fullScreen)
        return { maxWidth: modelState.newWidth }

      return null
    })

    watch(
      () => props.active,
      (value) => {
        modelState.isActive = value
      },
    )

    watch(
      () => modelState.isActive,
      (value) => {
        if (value)
          modelState.destroyed = false

        handleScroll()
        // nextTick(() => {
        //   if (value && root.$el && 'focus' in root.$el && props.autoFocus) {
        //     (root.$el as HTMLElement).focus();
        //   }
        // });
      },
    )

    function handleScroll() {
      if (typeof window === 'undefined')
        return

      if (props.scroll === 'clip') {
        if (modelState.isActive)
          document.documentElement.classList.add('is-clipped')
        else
          document.documentElement.classList.remove('is-clipped')

        return
      }

      modelState.savedScrollTop = !modelState.savedScrollTop
        ? document.documentElement.scrollTop
        : modelState.savedScrollTop

      if (modelState.isActive)
        document.body.classList.add('is-noscroll')
      else
        document.body.classList.remove('is-noscroll')

      if (modelState.isActive) {
        document.body.style.top = `-${modelState.savedScrollTop}px`
        return
      }

      document.documentElement.scrollTop = modelState.savedScrollTop
      document.body.style.top = ''
      modelState.savedScrollTop = null
    }

    /**
     * Close the Modal if canCancel and call the onCancel prop (function).
     */
    function cancel(method: string) {
      if (!cancelOptions.value.includes(method))
        return

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
      if (props.programmatic)
        modelState.isActive = false
    }

    /**
     * Keypress event that is bound to the document.
     */
    function keyPress({ key }: KeyboardEvent) {
      if (modelState.isActive && (key === 'Escape' || key === 'Esc'))
        cancel('escape')
    }

    /**
     * Transition after-enter hook
     */
    function afterEnter() {
      modelState.animating = false
      emit('afterEnter')
    }

    /**
     * Transition before-leave hook
     */
    function beforeLeave() {
      modelState.animating = true
    }

    /**
     * Transition after-leave hook
     */
    function afterLeave() {
      if (props.destroyOnHide)
        modelState.destroyed = true

      emit('afterLeave')
    }

    if (typeof window !== 'undefined')
      document.addEventListener('keyup', keyPress)

    onMounted(() => {
      activate()

      if (props.programmatic)
        modelState.isActive = true
      else if (modelState.isActive)
        handleScroll()
    })

    onBeforeUnmount(() => {
      if (typeof window !== 'undefined') {
        document.removeEventListener('keyup', keyPress)
        // reset scroll
        document.documentElement.classList.remove('is-clipped')
        const savedScrollTop = !modelState.savedScrollTop
          ? document.documentElement.scrollTop
          : modelState.savedScrollTop
        document.body.classList.remove('is-noscroll')
        document.documentElement.scrollTop = savedScrollTop
        document.body.style.top = ''
      }
    })

    return {
      modelState,
      customStyle,
      showX,
      close,
      cancel,
      afterEnter,
      beforeLeave,
      afterLeave,
    }
  },
})
</script>

<template>
  <teleport to="body">
    <transition
      :name="animation"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @after-leave="afterLeave"
    >
      <div
        v-if="!modelState.destroyed"
        v-show="modelState.isActive"
        ref="modal"
        class="modal is-active"
        :class="[{ 'is-full-screen': fullScreen }, customClass]"
        tabindex="-1"
        :role="ariaRole"
        :aria-label="ariaLabel"
        :aria-modal="ariaModal"
      >
        <div class="modal-background" @click="cancel('outside')" />
        <div
          class="animation-content"
          :class="{ 'modal-content': !hasModalCard }"
          :style="customStyle"
        >
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
    </transition>
  </teleport>
</template>
