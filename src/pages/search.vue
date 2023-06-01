<script setup lang="ts">
const user = useSupabaseUser()
const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()
const userStore = useUserStore()

const q = route.query?.q ? getRouterParamsAsString(route.query.q) : null

await useAsyncData('userFavourites', async () => await userStore.fetchUserFavourites(user.value?.id))
await useAsyncData('notes', async () => await notesStore.fetchSearchNotes(q || ''))

const { data: expansions } = await useLazyFetch('/api/blizzard/expansion/all')
const { data: expansionInstances } = await useLazyFetch(
  () => `/api/blizzard/expansion/instances/${expansions.value.at(-1).id}`,
  {
    pick: ['raids'],
  }
)
const { data: instance } = await useLazyFetch(
  () => `/api/blizzard/instance/${expansionInstances.value.raids.at(-1).id}`
)
const encounters = computed(() => instance.value.encounters.map((i) => i.name))

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
