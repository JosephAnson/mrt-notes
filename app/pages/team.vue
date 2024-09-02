<script lang="ts" setup>
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <Section>
    <Container>
      <Heading h1>
        Team Players
      </Heading>
      <TeamMembers />
    </Container>
  </Section>
</template>
