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
      <TheFeedback />
      <BaseToaster theme="dark" rich-colors class="pointer-events-auto" />

      <div class="notices fixed bottom-10 right-10 z-10">
        <UpdateNotification>
          <div class="prose prose-invert text-sm">
            <strong class="!mb-1 block">Fixed: Page Loading Issues</strong>
            <p class="!m-0">
              Improve stability across the app, thank you to <NuxtLink to="/profile/Skeptikk">
                Skeptikk
              </NuxtLink> for reporting these issues.
            </p>
          </div>
        </UpdateNotification>
      </div>
    </div>
  </ConfigProvider>
</template>
