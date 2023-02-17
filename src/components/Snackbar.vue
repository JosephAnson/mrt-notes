<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue'

interface SnackbarState {
  isActive: boolean
  timer: any
}

export default defineComponent({
  props: {
    background: { type: String, default: 'text-gray-400' },
    message: { type: [String, Array], default: null },
    duration: { type: Number, default: 3500 },
    actionText: {
      type: String,
      default: 'OK',
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const snackbarState = reactive<SnackbarState>({
      isActive: false,
      timer: undefined,
    })

    function close(): void {
      if (snackbarState.timer)
        clearTimeout(snackbarState.timer)

      snackbarState.isActive = false
      emit('close')
    }

    function showNotice(): void {
      snackbarState.isActive = true

      snackbarState.timer = setTimeout(() => {
        close()
      }, props.duration)
    }

    onMounted(() => showNotice())

    return {
      snackbarState,
      close,
    }
  },
})
</script>

<template>
  <teleport to=".notices">
    <transition enter-active-class="fade-in-down" leave-active-class="fade-out">
      <div
        v-show="snackbarState.isActive"
        class="flex items-center w-full max-w-xs p-4 rounded-lg shadow text-gray-400 bg-gray-800"
        :class="[background]"
      >
        <template v-if="$slots.default">
          <slot />
        </template>
        <template v-else>
          {{ message }}
        </template>

        <Button class="flex-grow-0 ml-4">
          {{ actionText }}
        </Button>
      </div>
    </transition>
  </teleport>
</template>
