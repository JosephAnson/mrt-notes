<script setup lang="ts">
useHead({
  meta: [
    {
      name: 'keywords',
      content: 'MRT Notes, raid planning, raid leaders, MRT note, raid organization, boss spell automation, note sharing, raid notes, raid strategy, raid coordination',
    },
  ],
})
</script>

<template>
  <div>
    <SeoKit />
    <Navbar />
    <NuxtPage />
    <Footer />

    <div class="notices fixed bottom-10 right-10 z-10">
      <UpdateNotification>
        <div class="prose text-sm">
          <strong class="!mb-1 block">Fixed: Page Loading Issues</strong>
          <p class="!m-0">
            Fixes done to improve stability across the app, thank you to <NuxtLink to="/profile/Skeptikk">
              Skeptikk
            </NuxtLink> for reporting these issue.
          </p>
        </div>
      </UpdateNotification>
    </div>
  </div>
</template>
