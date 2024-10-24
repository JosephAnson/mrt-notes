<script setup lang="ts">
import { getAllNotes, searchAllNotes } from '~/services/notes'

const { data: encounters } = await useFetch('/api/blizzard/latestEncounters')

const expansion = ref(encounters.value?.currentExpansion?.id || '')
const instance = ref(encounters.value?.currentRaid?.id || '')
const encounter = ref(encounters.value?.currentInstance?.id || '')

const { data: notes } = await useAsyncData(`notes-${encounter.value}`, async () => {
  return encounter.value ? await searchAllNotes(encounter.value) : await getAllNotes({ limit: 30 })
}, {
  watch: [encounter],
})
</script>

<template>
  <BaseSection>
    <BaseContainer>
      <BaseHeading h1>
        Find Notes
      </BaseHeading>

      <BaseCard class="mb-8">
        <BaseCardBlock>
          <BaseEncounterSelector
            v-model:expansion="expansion"
            v-model:instance="instance"
            v-model:encounter="encounter"
            class="w-full"
          />
        </BaseCardBlock>
      </BaseCard>

      <div id="notelist">
        <Ad ad-slot="2821798678" />

        <NoteItem v-for="note in notes" :key="note.id" :note="note" />
      </div>
    </BaseContainer>
  </BaseSection>
</template>
