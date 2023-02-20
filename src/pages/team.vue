<script lang="ts" setup>
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <Page>
    <Container>
      <Heading h1> Team Members </Heading>
      <TeamMembers />
    </Container>
  </Page>
</template>
