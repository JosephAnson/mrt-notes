<script lang="ts">
import { onClickOutside } from '@vueuse/core'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Tooltip',
  props: {
    active: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'is-primary',
    },
    label: {
      type: String,
      default: undefined,
    },
    contentClass: {
      type: String,
      default: undefined,
    },
  },
  setup() {
    const tooltip = ref(null)
    const isActive = ref(false)

    function onHover() {
      open()
    }

    function onFocus() {
      open()
    }

    function open() {
      isActive.value = true
    }

    function close() {
      isActive.value = false
    }

    /**
     * Close tooltip if clicked outside.
     */
    onClickOutside(tooltip, () => {
      isActive.value = false
    })

    return {
      isActive,
      tooltip,
      onHover,
      onFocus,
      close,
    }
  },
})
</script>

<template>
  <div ref="tooltip" class="relative">
    <transition>
      <div
        v-show="!disabled && active && isActive"
        class="absolute top-100% bg-black/50 whitespace-nowrap py-1 px-2 shadow rounded"
        :class="[contentClass]"
      >
        <template v-if="label">
          {{ label }}
        </template>
        <template v-else-if="$slots.content">
          <slot name="content" />
        </template>
      </div>
    </transition>
    <div class="tooltip-trigger" @mouseenter="onHover" @focus.capture="onFocus" @mouseleave="close">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.125s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
