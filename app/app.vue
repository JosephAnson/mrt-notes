<script setup lang="ts">
useHead({
  meta: [
    {
      name: 'keywords',
      content: 'MRT Notes, raid planning, raid leaders, MRT note, raid organization, boss spell automation, note sharing, raid notes, raid strategy, raid coordination',
    },
  ],
  htmlAttrs: {
    class: 'dark',
  },
})

const useIdFunction = () => useId()
</script>

<template>
  <ConfigProvider :use-id="useIdFunction">
    <div vaul-drawer-wrapper>
      <TheHeader />
      <NuxtPage />
      <TheFooter />
      <Feedback>
        <BaseButton
          variant="secondary"
          class="fixed right-0 bottom-20 -translate-y-1/2 rotate-90 origin-top-right !rounded-t-none"
        >
          Contact Us
        </BaseButton>
      </Feedback>
      <BaseToaster theme="dark" rich-colors class="pointer-events-auto" />
    </div>
  </ConfigProvider>
</template>
