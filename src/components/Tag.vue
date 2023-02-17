<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    attached: Boolean,
    closable: Boolean,
    type: { type: String, default: null },
    size: { type: String, default: null },
    rounded: Boolean,
    disabled: Boolean,
    ellipsis: Boolean,
    tabstop: { type: Boolean, default: true },
    ariaCloseLabel: { type: String, default: null },
    closeType: { type: String, default: null },
    closeIcon: { type: String, default: null },
    closeIconPack: { type: String, default: null },
    closeIconType: { type: String, default: null },
  },
  emits: ['close'],
  setup(props, { emit }) {
    /**
     * Emit close event when delete button is clicked
     * or delete key is pressed.
     */
    function close(event: any) {
      if (props.disabled)
        return

      emit('close', event)
    }

    return {
      close,
    }
  },
})
</script>

<template>
  <div v-if="attached && closable" class="tags has-addons">
    <span class="tag" :class="[type, size, { 'is-rounded': rounded }]">
      <span :class="{ 'has-ellipsis': ellipsis }">
        <slot />
      </span>
    </span>
    <a
      class="tag"
      role="button"
      :aria-label="ariaCloseLabel"
      :tabindex="tabstop ? 0 : false"
      :disabled="disabled ? true : null"
      :class="[
        size,
        closeType,
        { 'is-rounded': rounded },
        closeIcon ? 'has-delete-icon' : 'is-delete',
      ]"
      @click="close"
      @keyup.delete.prevent="close"
    >
      <Icon
        v-if="closeIcon"
        custom-class=""
        :icon="closeIcon"
        :size="size"
        :type="closeIconType"
        :pack="closeIconPack"
      />
      <a />
    </a>
  </div>
  <span v-else class="tag" :class="[type, size, { 'is-rounded': rounded }]">
    <span :class="{ 'has-ellipsis': ellipsis }">
      <slot />
    </span>

    <a
      v-if="closable"
      role="button"
      :aria-label="ariaCloseLabel"
      class="delete is-small"
      :class="closeType"
      :disabled="disabled ? true : null"
      :tabindex="tabstop ? 0 : false"
      @click="close"
      @keyup.delete.prevent="close"
    />
  </span>
</template>
