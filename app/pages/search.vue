<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import { getAllNotes, searchAllNotes } from '~/services/notes'

const search = useRouteQuery<string>('q', '')

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
  <BaseSection>
    <BaseContainer>
      <Heading h1>
        Find Notes
      </Heading>

      <BaseCard class="mb-8">
        <BaseCardBlock>
          <form class="flex w-full mb-4 gap-3" @submit.prevent>
            <BaseField stacked label-for="search" label="Search" class="w-full">
              <BaseInput id="search" v-model="search" type="search" />
            </BaseField>
          </form>

          <div v-if="encounters" class="flex flex-wrap">
            <Heading h2 styled="h4">
              Search by encounter
            </Heading>
            <div>
              <BaseField label="Raids" stacked>
                <div class="flex flex-wrap gap-2 mb-4">
                  <BaseButton v-for="encounter in encounters.raids" :key="encounter" size="sm" @click="filterEncounter(encounter.name)">
                    {{ encounter.name }}
                  </BaseButton>
                </div>
              </BaseField>
              <BaseField label="Mythic+ Dungeons" stacked>
                <div class="flex flex-wrap gap-2 mb-4">
                  <BaseButton v-for="encounter in encounters.dungeons" :key="encounter" size="sm" @click="filterEncounter(encounter.name)">
                    {{ encounter.name }}
                  </BaseButton>
                </div>
              </BaseField>
            </div>
          </div>
        </BaseCardBlock>
      </BaseCard>

      <div id="notelist">
        <Ad ad-slot="2821798678" />

        <NoteItem v-for="note in notes" :key="note.id" :note="note" />
      </div>
    </BaseContainer>
  </BaseSection>
</template>
