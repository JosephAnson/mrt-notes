<script lang="ts" setup>
const { $formbricks } = useNuxtApp()
</script>

<template>
  <BaseButton
    variant="secondary"
    class="fixed right-0 bottom-20 -translate-y-1/2 rotate-90 origin-top-right !rounded-t-none"
    @click="$formbricks.track('global_feedback_clicked')"
  >
    <span>Contact us</span>
  </BaseButton>
</template>
