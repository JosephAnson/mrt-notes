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
      <Heading h1>
        Notes
      </Heading>

      <div v-for="note in notes" :key="note.id">
        <nuxt-link :to="`/note/${note.id}` ">
          <Button>Open note: {{ note.name }}</Button>
        </nuxt-link>
      </div>
    </Container>
  </Page>
</template>
