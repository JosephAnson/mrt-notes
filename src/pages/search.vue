<script setup lang="ts">
const user = useSupabaseUser()
const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()
const userStore = useUserStore()

const q = route.query?.q ? getRouterParamsAsString(route.query.q) : null

await useAsyncData('userFavourites', async () => await userStore.fetchUserFavourites(user.value?.id))
await useAsyncData('notes', async () => await notesStore.fetchSearchNotes(q || ''))

const search = ref(q || '')

async function searchNotes() {
  if (search.value) {
    router.push({
      name: 'search',
      query: {
        q: search.value,
      },
    })

    await notesStore.fetchSearchNotes(search.value)
  }
}
</script>

<template>
  <Section>
    <Container>
      <form class="mb-10" @submit.prevent="searchNotes">
        <Heading h1>Find Notes</Heading>
        <Field label-for="search" label="Search" stacked>
          <Input id="search" v-model="search" type="search" />
        </Field>
        <Button type="submit"> Search </Button>
      </form>

      <NoteItem v-for="note in notesStore.notes.search" :key="note.id" :note="note" />
    </Container>
  </Section>
</template>
