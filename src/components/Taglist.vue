<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    attached: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<template>
  <div class="tags" :class="{ 'has-addons': attached }">
    <slot />
  </div>
</template>
