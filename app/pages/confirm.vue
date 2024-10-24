<script setup lang="ts">
const user = useSupabaseUser()
const router = useRouter()

watch(() => user.value, () => {
  if (user.value) {
    router.push('/')
  }
}, { immediate: true, deep: true })

onMounted(() => {
  if (user.value) {
    router.push('/')
  }
})
</script>

<template>
  <BaseSection>
    <BaseContainer>
      <Loading>Waiting for login...</Loading>
    </BaseContainer>
  </BaseSection>
</template>
