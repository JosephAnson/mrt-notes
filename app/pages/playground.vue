<script setup lang="ts">
import type { EditorData } from '~/types'

const editor = reactive<EditorData>({
  value: '',
  json: {},
})
const groupsStore = useGroupsStore()

groupsStore.clearGroups()

const { data: encounters } = await useFetch('/api/blizzard/latestEncounters')

const expansion = ref(encounters.value.currentExpansion.id)
const instance = ref(encounters.value.currentRaid.id)
const encounter = ref(encounters.value.currentInstance.id)

const { pending: spellsLoading, data: encounterSpells } = await useFetch(() => `/api/blizzard/encounter/spells/${encounter.value}`)
</script>

<template>
  <Section>
    <Container>
      <div class="flex justify-between">
        <Heading h1>
          Playground
        </Heading>
        <BaseNotification variant="destructive">
          Warning this doesn't save at all
        </BaseNotification>
      </div>
      <Ad ad-slot="8629692962" />
      <BaseCard class="mb-4">
        <BaseCardHeader>Select Encounter</BaseCardHeader>
        <BaseCardContent>
          <EncounterSelector
            v-model:expansion="expansion"
            v-model:instance="instance"
            v-model:encounter="encounter"
          />
        </BaseCardContent>
      </BaseCard>

      <Loading v-if="spellsLoading">
        Spells Loading
      </Loading>
      <section id="ERT-Editor">
        <div class="md:grid grid-cols-12 gap-8">
          <div class="sm:col-span-12 md:col-span-6">
            <BaseCard>
              <BaseCardHeader>Input Note</BaseCardHeader>
              <Editor v-model="editor.value" class="block" :spells="encounterSpells.spells" @update:json="editor.json = $event" />
            </BaseCard>

            <p>Login for more features</p>
          </div>
          <div class="sm:col-span-12 md:col-span-6">
            <NotePreview :note-json="editor.json" :note-string="editor.value" :groups="[]" />
          </div>
        </div>
      </section>
    </Container>
  </Section>
</template>
