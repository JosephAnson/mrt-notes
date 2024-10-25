<script lang="ts" setup>
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <BaseSection>
    <BaseContainer>
      <BaseCard>
        <BaseCardHeader>
          <BaseCardTitle as="h1">
            Team Players
          </BaseCardTitle>
        </BaseCardHeader>
        <BaseCardContent>
          <TeamMembers />
        </BaseCardContent>
      </BaseCard>
    </BaseContainer>
  </BaseSection>
</template>
