<script lang="ts" setup>
import { generateJSON } from '@tiptap/html'
import { toast } from 'vue-sonner'
import type { EditorData } from '~/types'

definePageMeta({
  middleware: 'auth',
})

const user = useSupabaseUser()
const router = useRouter()

const { data: encounters } = await useFetch('/api/blizzard/latestEncounters')
const { data: members } = await useFetch('/api/team/all', { key: 'team-all', watch: [user] })

const name = ref('')
const saving = ref(false)

const description = ref('')
const expansion = ref(encounters.value.currentExpansion.id)
const instance = ref(encounters.value.currentRaid.id)
const encounter = ref(encounters.value.currentInstance.id)

const editor = reactive<EditorData>({
  value: '',
  json: generateJSON('', editorExtensions),
})

async function create() {
  saving.value = true
  const { data } = await updateNote({
    name: name.value,
    description: description.value,
    editor_string: editor.value,
    expansion: expansion.value,
    instance: instance.value,
    encounter: encounter.value,
  })
  saving.value = false
  toast.success('Saved note')
  await router.push(`/note/edit/${data.id}`)
}
</script>

<template>
  <BaseSection>
    <BaseContainer>
      <div class="md:flex justify-between items-end mb-4">
        <BaseHeading h1 class="mb-0">
          Create MRT Note
        </BaseHeading>

        <div class="flex items-center gap-2">
          <div v-if="saving" class="flex item-center mr-4">
            <p class="mr-4">
              Saving
            </p>
            <div class="i-carbon-catalog animate-spin h-6 w-6" />
          </div>

          <BaseButton :disabled="!name || !editor.value" @click="create">
            Create Note
          </BaseButton>
        </div>
      </div>

      <BaseCard>
        <BaseCardBlock>
          <BaseField label="Title" stacked>
            <BaseInput v-model="name" />
          </BaseField>

          <BaseField label="Description" stacked>
            <BaseTextarea v-model="description" type="textarea" />
          </BaseField>

          <BaseEncounterSelector
            v-model:expansion="expansion"
            v-model:instance="instance"
            v-model:encounter="encounter"
          />
        </BaseCardBlock>
      </BaseCard>

      <div class="md:grid gap-4 grid-cols-2 mb-4">
        <BaseCard>
          <BaseCardHeader>
            MRT Note Editor
          </BaseCardHeader>
          <Editor
            key="main-editor"
            v-model="editor.value"
            :members="members"
            :encounter="encounter"
            @update:json="editor.json = $event"
          />
        </BaseCard>

        <div>
          <EditorNoteGroupPreview :note-json="editor.json " :note-string="editor.value" />
        </div>
      </div>

      <BaseCard>
        <BaseCardBlock>
          <TeamMembers />
        </BaseCardBlock>
      </BaseCard>
    </BaseContainer>
  </BaseSection>
</template>
