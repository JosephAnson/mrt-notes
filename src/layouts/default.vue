<script lang="ts" setup>
useHead({
  meta: [{ content: 'width=device-width, initial-scale=1, maximum-scale=1' }],
})
</script>

<template>
  <div>
    <Header />
    <slot />
    <Footer />
  </div>
</template>
