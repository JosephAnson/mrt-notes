<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const notes = useNotes()

const q = route.query?.q ? getRouterParamsAsString(route.query.q) : null

const { data: asyncNotes } = await useAsyncData('notes', async () =>
  q ? await searchAllNotes(q) : await getAllNotes()
)
if (asyncNotes.value) setNotes(asyncNotes.value)

const search = ref(q || '')

async function searchNotes() {
  if (search.value) {
    router.push({
      name: 'search',
      query: {
        q: search.value,
      },
    })

    setNotes(await searchAllNotes(search.value))
  } else {
    router.push({
      name: 'search',
    })

    setNotes(await getAllNotes())
  }
}
</script>

<template>
  <Page>
    <Container>
      <form class="mb-10" @submit.prevent="searchNotes">
        <Heading h1>Search</Heading>
        <Field label-for="search" label="Search" stacked>
          <Input id="search" v-model="search" type="search" />
        </Field>
        <Button type="submit"> Search </Button>
      </form>

      <NoteItem v-for="note in notes" :key="note.id" :note="note" />
    </Container>
  </Page>
</template>
