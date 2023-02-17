<script lang='ts' setup>
import { getAllNotes } from '~/services/notes'

definePageMeta({
  middleware: 'auth',
})

const { data: notes } = await useAsyncData('notes', async () => {
  const { data } = await getAllNotes()
  return data
})
</script>

<template>
  <Page>
    <Container>
      here's ya notes

      <nuxt-link><Button>Open note</Button></nuxt-link>

      <pre>{{ notes }}</pre>
    </Container>
  </Page>
</template>
