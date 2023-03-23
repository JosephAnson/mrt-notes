<template>
  <div ref="tooltip" :class="rootClasses">
    <transition :name="newAnimation">
      <div
        v-show="!disabled && active && (tooltipState.isActive || always)"
        ref="content"
        :class="['tooltip-content', contentClass]"
        :style="tooltipState.style"
      >
        <template v-if="label">{{ label }}</template>
        <template v-else-if="$slots.content">
          <slot name="content" />
        </template>
      </div>
    </transition>
    <div
      ref="trigger"
      class="tooltip-trigger"
      @click="onClick"
      @contextmenu="onContextMenu"
      @mouseenter="onHover"
      @focus.capture="onFocus"
      @mouseleave="close"
    >
      <slot ref="slot" />
    </div>
  </div>
</template>

<script lang="ts">
import { onClickOutside } from '@vueuse/core';
import { computed, defineComponent, nextTick, reactive, ref } from 'vue';
import type { PropType } from 'vue';

interface TooltipState {
  isActive: boolean;
  style: {
    width?: string;
    heigth?: string;
    position?: string;
    zIndex?: string;
    top?: string;
    left?: string;
  };
  timer: any;
}

export default defineComponent({
  name: 'Tooltip',
  props: {
    active: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'is-primary'
    },
    label: {
      type: String,
      default: undefined
    },
    triggers: {
      type: Array as PropType<string[]>,
      default: () => ['hover']
    },
    always: Boolean,
    square: Boolean,
    dashed: Boolean,
    multilined: Boolean,
    size: {
      type: String,
      default: 'is-medium'
    },
    animated: {
      type: Boolean,
      default: true
    },
    animation: {
      type: String,
      default: 'fade'
    },
    contentClass: {
      type: String,
      default: undefined
    },
    position: {
      type: String,
      default: 'is-top'
    }
  },
  setup(props) {
    const tooltip = ref(null);

    const tooltipState = reactive<TooltipState>({
      isActive: false,
      style: {},
      timer: null
    });

    const rootClasses = computed<(string | Record<string, boolean | undefined>)[]>(() => {
      return [
        'v-tooltip',
        props.type,
        props.position,
        props.size,
        {
          'is-square': props.square,
          'is-always': props.always,
          'is-multiline': props.multilined,
          'is-dashed': props.dashed
        }
      ];
    });

    const newAnimation = computed(() => {
      return props.animated ? props.animation : undefined;
    });

    function onClick() {
      if (props.triggers.indexOf('click') < 0) {
        return;
      }
      // if not active, toggle after clickOutside event
      // this fixes toggling programmatic
      nextTick(() => {
        setTimeout(() => open());
      });
    }

    function onHover() {
      if (props.triggers.indexOf('hover') < 0) {
        return;
      }
      open();
    }

    function onContextMenu(e: Event) {
      if (props.triggers.indexOf('contextmenu') < 0) {
        return;
      }
      e.preventDefault();
      open();
    }

    function onFocus() {
      if (props.triggers.indexOf('focus') < 0) {
        return;
      }
      open();
    }

    function open() {
      tooltipState.isActive = true;
    }

    function close() {
      tooltipState.isActive = false;
    }

    /**
     * Close tooltip if clicked outside.
     */
    onClickOutside(tooltip, () => {
      tooltipState.isActive = false;
    });

    return {
      tooltipState,
      rootClasses,
      newAnimation,
      tooltip,
      onClick,
      onContextMenu,
      onHover,
      onFocus,
      close
    };
  }
});
</script>
