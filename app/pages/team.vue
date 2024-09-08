<script lang="ts" setup>
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <BaseSection>
    <BaseContainer>
      <BaseHeading h1>
        Team Players
      </BaseHeading>
      <TeamMembers />
    </BaseContainer>
  </BaseSection>
</template>
