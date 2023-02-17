<script lang="ts">
import { useMeta } from '#meta'

export default {
  setup() {
    useMeta({
      meta: [{ content: 'width=device-width, initial-scale=1, maximum-scale=1' }],
      bodyAttrs: {
        class: 'bg-white',
      },
    })
  },
}
</script>

<template>
  <div>
    <Header />
    <slot />
    <Footer />
  </div>
</template>
