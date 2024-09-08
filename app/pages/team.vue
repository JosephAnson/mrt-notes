<script lang="ts" setup>
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <BaseSection>
    <BaseContainer>
      <Heading h1>
        Team Players
      </Heading>
      <TeamMembers />
    </BaseContainer>
  </BaseSection>
</template>
