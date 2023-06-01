<script setup lang="ts">
const user = useSupabaseUser()
const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()
const userStore = useUserStore()

const q = route.query?.q ? getRouterParamsAsString(route.query.q) : null

await useAsyncData('userFavourites', async () => await userStore.fetchUserFavourites(user.value?.id))
await useAsyncData('notes', async () => await notesStore.fetchSearchNotes(q || ''))

const { data: encounters } = await useLazyAsyncData('encounters', async () => await getLatestEncounters())

const search = ref(q || '')

function filterEncounter(encounter: string) {
  search.value = encounter

  searchNotes()
}
async function searchNotes() {
  router.push({
    name: 'search',
    query: {
      q: search.value,
    },
  })

  await notesStore.fetchSearchNotes(search.value)
}
</script>

<template>
  <Section>
    <Container>
      <Heading h1>Find Notes</Heading>

      <div class="flex flex-wrap gap-2 mb-2">
        <Button v-for="encounter in encounters" :key="encounter" @click="filterEncounter(encounter)">
          {{ encounter }}
        </Button>
      </div>

      <form class="mb-10" @submit.prevent="searchNotes">
        <Field label-for="search" label="Search" stacked>
          <Input id="search" v-model="search" type="search" />
        </Field>
        <Button type="submit"> Search </Button>
      </form>

      <NoteItem v-for="note in notesStore.notes.search" :key="note.id" :note="note" />
    </Container>
  </Section>
</template>
