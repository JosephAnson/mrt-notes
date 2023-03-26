<script setup lang="ts">
import type { EditorData } from '~/types'

const editor = reactive<EditorData>({
  value: '',
  json: {},
})
const noteStore = useNoteStore()
const groupsStore = useGroupsStore()

groupsStore.clearGroups()

const expansion = ref(503)
const instance = ref(1200)
const encounter = ref(2480)

const { pending: spellsLoading } = await useLazyFetch(() => `/api/blizzard/encounter/spells/${encounter.value}`, {
  onResponse({ response }) {
    noteStore.setSpells(response._data.spells)
    return response._data
  },
})
</script>

<template>
  <Section>
    <Container>
      <div class="flex justify-between">
        <Heading h1> Playground </Heading>
        <p class="mb-4 bg-red-700 py-2 px-4 inline-block rounded">Warning this doesn't save at all</p>
      </div>
      <EncounterSelector
        v-model:expansion="expansion"
        v-model:instance="instance"
        v-model:encounter="encounter"
      ></EncounterSelector>
      <Loading v-if="spellsLoading">Spells Loading</Loading>
      <section id="ERT-Editor">
        <div class="md:grid grid-cols-12 gap-8">
          <div class="sm:col-span-12 md:col-span-6">
            <Editor v-model="editor.value" class="block" @update:json="editor.json = $event" />

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
