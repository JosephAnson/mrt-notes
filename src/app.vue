<script setup lang="ts">
useHead({
  meta: [
    {
      name: 'keywords',
      value:
        'MRT Notes, raid planning, raid leaders, MRT note, raid organization, boss spell automation, note sharing, raid notes, raid strategy, raid coordination',
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
          <strong class="!mb-1 block">Fixed: Spell ID imports correctly</strong>
          <p class="!m-0">
            To fix your current notes please copy and paste the note back into the editor to correct the spell tags
            automatically.
            <code>{spell: 111} converts into {spell:111}</code>
          </p>
        </div>
      </UpdateNotification>
    </div>
  </div>
</template>
