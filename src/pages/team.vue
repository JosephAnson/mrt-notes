<script lang="ts" setup>
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <Section>
    <Container>
      <Heading h1>
        Team Members
      </Heading>
      <TeamMembers />
    </Container>
  </Section>
</template>
