<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()

const q = computed(() => route.query?.q ? getRouterParamsAsString(route.query.q) : null)

await useAsyncData(`notes-${route.query.q}`, async () => await notesStore.fetchSearchNotes(q.value || ''), {
  watch: [q],
})

const { data: encounters } = await useAsyncData('encounters', async () => await getLatestEncounters())

const search = ref(q.value || '')

function filterEncounter(encounter: string) {
  search.value = encounter

  searchNotes()
}
async function searchNotes() {
  await router.push({
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
      <Heading h1>
        Find Notes
      </Heading>

      <div class="bg-gray-900 p-4 rounded mb-8">
        <form class="flex w-full mb-4 gap-3" @submit.prevent="searchNotes">
          <Field label-for="search" label="Search" class="w-full">
            <Input id="search" v-model="search" type="search" />
          </Field>
          <Button type="submit">
            Search
          </Button>
        </form>

        <div v-if="encounters" class="flex flex-wrap">
          <Heading h2 styled="h4">
            Search by encounter
          </Heading>
          <div>
            <label class="mb-1 block">Raids</label>
            <div class="flex flex-wrap gap-2 mb-4">
              <Button v-for="encounter in encounters.raids" :key="encounter" @click="filterEncounter(encounter)">
                {{ encounter }}
              </Button>
            </div>
            <label class="mb-1 block">Mythic+ Dungeons</label>
            <div class="flex flex-wrap gap-2 mb-4">
              <Button v-for="encounter in encounters.dungeons" :key="encounter" @click="filterEncounter(encounter)">
                {{ encounter }}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div id="notelist">
        <Ad ad-slot="2821798678" />

        <NoteItem v-for="note in notesStore.search" :key="note.id" :note="note" />
      </div>
    </Container>
  </Section>
</template>
