<script setup lang='ts'>
defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <div class='flex justify-center items-center'>
    <Adsbygoogle :ad-style='{ "max-height": "115px", display: "block" }' v-bind='$attrs' ></Adsbygoogle>
  </div>
</template>

