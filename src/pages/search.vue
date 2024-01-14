<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import { getAllNotes, searchAllNotes } from '~/services/notes'

const search = useRouteQuery<string>('search', '')

const { data: notes } = await useAsyncData(`notes-${search.value}`, async () => {
  return search.value?.length ? await searchAllNotes(search.value) : await getAllNotes({ limit: 30 })
}, {
  watch: [search],
})

const { data: encounters } = await useFetch('/api/blizzard/latestEncounters')

function filterEncounter(encounter: string) {
  search.value = encounter
}
</script>

<template>
  <Section>
    <Container>
      <Heading h1>
        Find Notes
      </Heading>

      <div class="bg-gray-900 p-4 rounded mb-8">
        <form class="flex w-full mb-4 gap-3" @submit.prevent>
          <Field label-for="search" label="Search" class="w-full">
            <Input id="search" v-model="search" type="search" />
          </Field>
        </form>

        <div v-if="encounters" class="flex flex-wrap">
          <Heading h2 styled="h4">
            Search by encounter
          </Heading>
          <div>
            <label class="mb-1 block">Raids</label>
            <div class="flex flex-wrap gap-2 mb-4">
              <Button v-for="encounter in encounters.raids" :key="encounter" @click="filterEncounter(encounter.name)">
                {{ encounter.name }}
              </Button>
            </div>
            <label class="mb-1 block">Mythic+ Dungeons</label>
            <div class="flex flex-wrap gap-2 mb-4">
              <Button v-for="encounter in encounters.dungeons" :key="encounter" @click="filterEncounter(encounter.name)">
                {{ encounter.name }}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div id="notelist">
        <Ad ad-slot="2821798678" />

        <NoteItem v-for="note in notes" :key="note.id" :note="note" />
      </div>
    </Container>
  </Section>
</template>
