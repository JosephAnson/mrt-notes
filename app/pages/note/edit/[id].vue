<script lang="ts" setup>
import { generateJSON } from '@tiptap/html'
import { toast } from 'vue-sonner'
import { deleteNote as deleteNoteApi } from '~/services/notes'
import type { EditorData } from '~/types'

definePageMeta({
  middleware: 'note-edit',
})

const route = useRoute('note-edit-id')

const { data: encounters } = await useFetch('/api/blizzard/latestEncounters')
const { data: note } = await useAsyncData('notes', async () => await getNote(getRouterParamsAsString(route.params.id)))
const teamMembersStore = useTeamMembersStore()

const name = ref(note.value?.name || '')
const saving = ref(false)

const description = ref(note.value?.description || '')
const expansion = ref(note.value?.expansion || encounters.value.currentExpansion.id)
const instance = ref(note.value?.instance || encounters.value.currentRaid.id)
const encounter = ref(note.value?.encounter || encounters.value.currentInstance.id)

const editor = reactive<EditorData>({
  value: note.value?.editor_string || '',
  json: generateJSON(note.value?.editor_string || '', editorExtensions),
})

function save() {
  saving.value = true
  if (note.value) {
    updateNote({
      id: note.value.id,
      name: name.value,
      description: description.value,
      editor_string: editor.value,
      expansion: expansion.value,
      instance: instance.value,
      encounter: encounter.value,
    })
    saving.value = false
    toast.success('Saved note')
  }
}

async function deleteNoteAndRedirect() {
  openDialog({
    message: 'Are you sure you want to delete the note?',
    cancelText: 'No',
    confirmText: 'Yes',
    onConfirm: async () => {
      toast.success('Note has been deleted')

      if (note.value) {
        const router = useRouter()
        await deleteNoteApi(note.value.id)
        router.push('/')
      }
    },
  })
}

const { pending: spellsLoading, data: encounterSpells } = await useFetch(() => `/api/blizzard/encounter/spells/${encounter.value}`)
</script>

<template>
  <Section>
    <Container v-if="note">
      <div class="md:flex justify-between mb-4">
        <Heading h1>
          Mrt Notes
        </Heading>

        <div class="flex items-center gap-2">
          <div v-if="saving" class="flex item-center mr-4">
            <p class="mr-4">
              Saving
            </p>
            <div class="i-carbon-catalog animate-spin h-6 w-6" />
          </div>
          <BaseButton variant="destructive" @click="deleteNoteAndRedirect">
            Delete Note
          </BaseButton>
          <BaseButton @click="save">
            Save Note
          </BaseButton>
        </div>
      </div>

      <BaseCard class="mb-8">
        <BaseCardBlock>
          <BaseField label="Title" stacked>
            <BaseInput v-model="name" />
          </BaseField>
          <BaseField label="Description" stacked>
            <BaseInput v-model="description" type="textarea" />
          </BaseField>
          <EncounterSelector
            v-model:expansion="expansion"
            v-model:instance="instance"
            v-model:encounter="encounter"
          />
          <Loading v-if="spellsLoading">
            Spells Loading
          </Loading>
        </BaseCardBlock>
      </BaseCard>
      <section>
        <div class="md:grid grid-cols-12 gap-8">
          <div class="sm:col-span-12 md:col-span-6">
            <div class="flex justify-between">
              <Heading h2>
                General Tactic
              </Heading>
            </div>

            <BaseCard class="mb-2">
              <Editor
                key="main-editor"
                v-model="editor.value"
                :members="teamMembersStore.members"
                class="block"
                :spells="encounterSpells?.spells"
                @update:json="editor.json = $event"
              />
            </BaseCard>

            <BaseCard class="mb-2">
              <TeamGroups :note-id="note.id" />
            </BaseCard>

            <BaseCard class="mb-2">
              <TeamMembers />
            </BaseCard>
          </div>
          <div class="sm:col-span-12 md:col-span-6">
            <NotePreview :note-json="editor.json" :note-string="editor.value" />
          </div>
        </div>
      </section>
    </Container>
  </Section>
</template>
