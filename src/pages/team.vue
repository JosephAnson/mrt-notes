<script lang='ts' setup>
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <Page>
    <Container>
      <Heading>
        Team Members
      </Heading>
      <TeamMembers />
    </Container>
  </Page>
</template>
