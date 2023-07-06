<script setup lang='ts'>
defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div class="flex justify-center items-center">
    <Adsbygoogle :ad-style="{ &quot;max-height&quot;: &quot;115px&quot;, 'display': &quot;block&quot; }" v-bind="$attrs" />
  </div>
</template>
