<script setup lang="ts">
const user = useSupabaseUser()

watch(user, () => {
  if (user.value) {
    return navigateTo('/')
  }
}, { immediate: true })
</script>

<template>
  <BaseSection>
    <BaseContainer>
      <Loading>Waiting for login...</Loading>
    </BaseContainer>
  </BaseSection>
</template>
