<script setup lang="ts">
import type { EditorData } from '~/types'

const user = useSupabaseUser()
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
      <Ad ad-slot="9530994485" />
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

      <div class="md:grid grid-cols-2 gap-8">
        <div>
          <BaseCard class="h-full">
            <BaseCardHeader>Input Note</BaseCardHeader>
            <Editor v-model="editor.value" :encounter="encounter" @update:json="editor.json = $event" />
          </BaseCard>

          <BaseButton v-if="!user" as-child>
            <NuxtLink to="/login">
              Login for more features
            </NuxtLink>
          </BaseButton>
        </div>
        <EditorNoteGroupPreview :note-json="editor.json" :note-string="editor.value" :groups="[]" />
      </div>

      <BaseCard v-if="user" class="mt-4">
        <BaseCardBlock>
          <TeamMembers />
        </BaseCardBlock>
      </BaseCard>
    </BaseContainer>
  </BaseSection>
</template>
