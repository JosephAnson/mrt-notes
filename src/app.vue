<script lang="ts" setup>
import './assets/tailwind.scss'
</script>

<template>
  <div>
    <Navbar />
    <NuxtPage />
    <Footer />
    <div class="notices" />
  </div>
</template>

<style lang="scss">
body {
  @apply bg-white;
}
</style>
