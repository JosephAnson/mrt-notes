<script lang="ts" setup>
import { generateJSON } from '@tiptap/html'
import { toast } from 'vue-sonner'
import { deleteNote as deleteNoteApi } from '~/services/notes'
import type { EditorData } from '~/types'

definePageMeta({
  middleware: 'note-edit',
})

const route = useRoute('note-edit-id')
const user = useSupabaseUser()

const { data: encounters } = await useFetch('/api/blizzard/latestEncounters')
const { data: note } = await useAsyncData('notes', async () => await getNote(getRouterParamsAsString(route.params.id)))
const { data: members } = await useFetch('/api/team/all', { key: 'team-all', watch: [user] })

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
  toast.success('Note has been deleted')

  if (note.value) {
    const router = useRouter()
    await deleteNoteApi(note.value.id)
    await router.push('/')
  }
}
</script>

<template>
  <BaseSection>
    <BaseContainer v-if="note">
      <div class="md:flex justify-between mb-4">
        <BaseHeading h1>
          Edit MRT Note
        </BaseHeading>

        <div class="flex items-center gap-2">
          <div v-if="saving" class="flex item-center mr-4">
            <p class="mr-4">
              Saving
            </p>
            <div class="i-carbon-catalog animate-spin h-6 w-6" />
          </div>

          <BaseAlertDialog>
            <BaseAlertDialogTrigger>
              <BaseButton variant="destructive">
                Delete Note
              </BaseButton>
            </BaseAlertDialogTrigger>
            <BaseAlertDialogContent>
              <BaseAlertDialogHeader>
                <BaseAlertDialogTitle>Are you sure you want to delete the note?</BaseAlertDialogTitle>
                <BaseAlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </BaseAlertDialogDescription>
              </BaseAlertDialogHeader>
              <BaseAlertDialogFooter>
                <BaseAlertDialogCancel>Cancel</BaseAlertDialogCancel>
                <BaseAlertDialogAction
                  variant="destructive"
                  @click="deleteNoteAndRedirect"
                >
                  Delete Note
                </BaseAlertDialogAction>
              </BaseAlertDialogFooter>
            </BaseAlertDialogContent>
          </BaseAlertDialog>
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
            <BaseTextarea v-model="description" type="textarea" />
          </BaseField>
          <BaseEncounterSelector
            v-model:expansion="expansion"
            v-model:instance="instance"
            v-model:encounter="encounter"
          />
        </BaseCardBlock>
      </BaseCard>
      <section>
        <div class="md:grid grid-cols-12 gap-8">
          <div class="sm:col-span-12 md:col-span-6">
            <BaseCard class="overflow-hidden">
              <BaseCardHeader>
                MRT Note Editor
              </BaseCardHeader>
              <Editor
                key="main-editor"
                v-model="editor.value"
                :members="members"
                class="block"
                :encounter="encounter"
                @update:json="editor.json = $event"
              />
            </BaseCard>

            <BaseCard>
              <BaseCardBlock>
                <TeamGroups :note-id="note.id" />
              </BaseCardBlock>
            </BaseCard>

            <BaseCard>
              <BaseCardBlock>
                <TeamMembers />
              </BaseCardBlock>
            </BaseCard>
          </div>
          <div class="sm:col-span-12 md:col-span-6">
            <EditorNoteGroupPreview :note-id="note.id" :note-json="editor.json" :note-string="editor.value" />
          </div>
        </div>
      </section>
    </BaseContainer>
  </BaseSection>
</template>
