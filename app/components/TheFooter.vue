<script setup lang='ts'>
</script>

<template>
  <footer class="py-10">
    <div class="container">
      <div class="md:flex grid gap-2">
        <Feedback as-child>
          <BaseButton variant="ghost">
            Submit issues or request features
          </BaseButton>
        </Feedback>
        <BaseButton as-child variant="ghost">
          <NuxtLink to="/privacypolicy" aria-label="Twitter Share Button">
            Privacy Policy
          </NuxtLink>
        </BaseButton>
        <BaseButton
          variant="ghost"
          aria-label="Twitter Share Button"
          @click="tweet"
        >
          <Icon name="ph:twitter-logo-duotone" class="i-carbon-logo-twitter inline-block text-xl mr-2" />
          Share on Twitter
        </BaseButton>
      </div>
    </div>
  </footer>
</template>
