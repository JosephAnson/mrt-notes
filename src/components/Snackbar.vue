<script lang="ts">
import { computed, defineComponent, onBeforeMount, onMounted, reactive } from 'vue'
import type { PropType } from 'vue'

interface SnackbarState {
  isActive: boolean
  parentTop: Element | null
  parentBottom: Element | null
  newContainer: string | null
  timer: any
  newDuration: number
}

export default defineComponent({
  props: {
    type: { type: String, default: 'is-dark' },
    message: { type: [String, Array], default: null },
    duration: { type: Number, default: null },
    container: { type: String, default: null },
    queue: { type: Boolean, default: false },
    indefinite: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: 'is-top',
    },
    actionText: {
      type: String,
      default: 'OK',
    },
    onAction: {
      type: Function as PropType<() => any>,
      default: null,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const snackbarState = reactive<SnackbarState>({
      isActive: false,
      parentTop: null,
      parentBottom: null,
      newContainer: props.container || null,
      timer: undefined,
      newDuration: props.duration || 3500,
    })

    const correctParent = computed<Element | null>(() => {
      switch (props.position) {
        case 'is-bottom-right':
        case 'is-bottom':
        case 'is-bottom-left':
          return snackbarState.parentBottom

        case 'is-top-right':
        case 'is-top':
        case 'is-top-left':
        default:
          return snackbarState.parentTop
      }
    })

    const transition = computed<Record<string, string>>(() => {
      switch (props.position) {
        case 'is-bottom-right':
        case 'is-bottom':
        case 'is-bottom-left':
          return {
            enter: 'fade-in-up',
            leave: 'fade-out',
          }
        case 'is-top-right':
        case 'is-top':
        case 'is-top-left':
        default:
          return {
            enter: 'fade-in-down',
            leave: 'fade-out',
          }
      }
    })

    /**
     * Click listener.
     * Call action prop before closing (from Mixin).
     */
    function action() {
      if (props.onAction)
        props.onAction()

      close()
    }

    function shouldQueue(): boolean {
      if (!props.queue || !snackbarState.parentTop || !snackbarState.parentBottom)
        return false

      return (
        snackbarState.parentTop.childElementCount > 0
        || snackbarState.parentBottom.childElementCount > 0
      )
    }

    function close(): void {
      if (snackbarState.timer)
        clearTimeout(snackbarState.timer)

      snackbarState.isActive = false
      emit('close')
    }

    function showNotice(): void {
      if (correctParent.value) {
        if (shouldQueue()) {
          // Call recursively if should queue
          setTimeout(() => showNotice(), 250)
          return
        }

        snackbarState.isActive = true

        if (!props.indefinite) {
          snackbarState.timer = setTimeout(() => {
            close()
          }, snackbarState.newDuration)
        }
      }
    }

    function setupContainer(): void {
      snackbarState.parentTop = document.querySelector(
        `${snackbarState.newContainer ? snackbarState.newContainer : 'body'}>.notices.is-top`,
      )
      snackbarState.parentBottom = document.querySelector(
        `${snackbarState.newContainer ? snackbarState.newContainer : 'body'}>.notices.is-bottom`,
      )

      if (snackbarState.parentTop && snackbarState.parentBottom)
        return

      if (!snackbarState.parentTop) {
        snackbarState.parentTop = document.createElement('div')
        snackbarState.parentTop.className = 'notices is-top'
      }

      if (!snackbarState.parentBottom) {
        snackbarState.parentBottom = document.createElement('div')
        snackbarState.parentBottom.className = 'notices is-bottom'
      }

      let container = snackbarState.newContainer
        ? document.querySelector(snackbarState.newContainer)
        : document.body
      if (!container)
        container = document.body

      container.appendChild(snackbarState.parentTop)
      container.appendChild(snackbarState.parentBottom)

      if (snackbarState.newContainer && snackbarState.parentTop && snackbarState.parentBottom) {
        snackbarState.parentTop.classList.add('has-custom-container')
        snackbarState.parentBottom.classList.add('has-custom-container')
      }
    }

    onBeforeMount(() => {
      setupContainer()
    })

    onMounted(() => {
      console.log('SHOW SNACK')
      showNotice()
    })

    return {
      transition,
      snackbarState,
      correctParent,
      action,
    }
  },
})
</script>

<template>
  <teleport to=".notices">
    <transition :enter-active-class="transition.enter" :leave-active-class="transition.leave">
      <div
        v-show="snackbarState.isActive"
        class="snackbar"
        :class="[type, position]"
        :role="actionText ? 'alertdialog' : 'alert'"
        :aria-modal="actionText"
      >
        <div class="text">
          <template v-if="$slots.default">
            <slot />
          </template>
          <template v-else>
            {{ message }}
          </template>
        </div>
        <div v-if="actionText" class="action" @click="action">
          <button :class="type" class="button is-inverted">
            {{ actionText }}
          </button>
        </div>
      </div>
    </transition>
  </teleport>
</template>
