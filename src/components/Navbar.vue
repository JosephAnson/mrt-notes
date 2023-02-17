<script lang="ts" setup>
function tweet(): void {
  const width = 575
  const height = 400
  const left = (window.screen.width - width) / 2
  const top = (window.screen.height - height) / 2
  const url = `https://twitter.com/share?url=${encodeURIComponent(
        `${document.location.protocol}//${document.location.host}`,
      )}&text=ERT Notes: Quick build ERT Notes to use in WoW&hashtags=ERTNotes&via=JosephLeeAnson`
  const opts = `status=1,width=${width},height=${height},top=${top},left=${left}`

  window.open(url, '', opts)
}
</script>

<template>
  <nav class="relative bg-primary-100">
    <Container>
      <div class="flex items-center justify-between py-2">
        <nuxt-link
          to="/"
          title="ERT: ERT Note creator for WoW"
          class="heading font-secondary font-semibold flex justify-start text-l mr-2"
        >
          ERT Notes
        </nuxt-link>

        <div class="menu flex">
          <Button class="mr-2" @click="tweet">
            Tweet
          </Button>

          <LoginButtons />
        </div>
      </div>
    </Container>
  </nav>
</template>
