<script setup lang="ts">
import type { EditorData } from '~/types'

const editor = reactive<EditorData>({
  value: '',
  json: {},
})

const { data: encounters } = await useFetch('/api/blizzard/latestEncounters')

const expansion = ref(encounters.value?.currentExpansion?.id)
const instance = ref(encounters.value?.currentRaid?.id)
const encounter = ref(encounters.value?.currentInstance?.id)
</script>

<template>
  <BaseSection>
    <BaseContainer>
      <div class="flex justify-between">
        <BaseHeading h1>
          Playground
        </BaseHeading>
        <BaseNotification variant="destructive">
          Warning this note will not be saved
        </BaseNotification>
      </div>
      <Ad ad-slot="8629692962" />
      <BaseCard class="mb-4">
        <BaseCardHeader>Select Encounter</BaseCardHeader>
        <BaseCardContent>
          <BaseEncounterSelector
            v-model:expansion="expansion"
            v-model:instance="instance"
            v-model:encounter="encounter"
          />
        </BaseCardContent>
      </BaseCard>

      <section id="ERT-Editor">
        <div class="md:grid grid-cols-12 gap-8">
          <div class="sm:col-span-12 md:col-span-6">
            <BaseCard>
              <BaseCardHeader>Input Note</BaseCardHeader>
              <Editor v-model="editor.value" class="block" :encounter="encounter" @update:json="editor.json = $event" />
            </BaseCard>

            <BaseButton as-child>
              <NuxtLink to="/login">
                Login for more features
              </NuxtLink>
            </BaseButton>
          </div>
          <div class="sm:col-span-12 md:col-span-6">
            <EditorNotePreview :note-json="editor.json" :note-string="editor.value" :groups="[]" />
          </div>
        </div>
      </section>
    </BaseContainer>
  </BaseSection>
</template>
