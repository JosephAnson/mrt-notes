<script lang="ts" setup>
import { generateJSON } from '@tiptap/html'
import type { EditorData } from '~/types'

definePageMeta({
  middleware: 'note-edit',
})

const notesStore = useNotesStore()

const { data: note } = await useAsyncData('notes', async () => {
  const route = useRoute()
  return await getNote(getRouterParamsAsString(route.params.id))
})

const name = ref(note.value?.name || '')
const saving = ref(false)
const description = ref(note.value?.description || '')
const expansion = ref(note.value?.expansion || 503)
const instance = ref(note.value?.instance || 1200)
const encounter = ref(note.value?.encounter || 2480)

const editor = reactive<EditorData>({
  value: note.value?.editor_string || '',
  json: generateJSON(note.value?.editor_string || '', editorExtensions),
})

const debouncedUpdateNote = useDebounceFn(
  () => {
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
    }
  },
  DEBOUNCE_TYPING_TIMER,
  { maxWait: 5000 }
)

function save() {
  saving.value = true
  debouncedUpdateNote()
}

async function deleteNoteAndRedirect() {
  if (note.value) {
    const router = useRouter()
    await notesStore.deleteNote(note.value.id)
    router.push('/')
  }
}

const { data: spellData, pending } = await useFetch(() => `/api/blizzard/encounter/spells/${encounter.value}`)
</script>

<template>
  <Section>
    <Container v-if="note">
      <Field label="Spells" stacked>
        <div v-if="!pending && spellData">
          <div v-for="spell in spellData.spells" :key="spell.id" class="flex space-between group relative">
            {{ spell.name }} (hover for info)

            <img
              v-if="spell.spellIdInformation"
              :src="`https://wow.zamimg.com/images/wow/icons/medium/${spell.spellIdInformation.icon}.jpg`"
              :alt="spell.spellIdInformation.name"
            />
            <SpellInformation
              class="hidden !absolute top-100% left-0 group-hover:block pointerevents-none"
              :icon="spell.spellIdInformation.icon"
              :tooltip="spell.spellIdInformation.tooltip"
            ></SpellInformation>
          </div>
        </div>
        <div v-else class="flex items-center">
          Loading Spells
          <div class="i-carbon-fire origin-center w-8 h-8 animate-spin animate-3s ml-2"></div>
        </div>
      </Field>
      <div class="flex justify-between mb-4">
        <Heading h1> Mrt Notes </Heading>

        <div class="flex items-center">
          <div v-if="saving" class="flex item-center mr-4">
            <p class="mr-4">Saving</p>
            <div class="i-carbon-catalog animate-spin h-6 w-6"></div>
          </div>
          <Button class="bg-red-700 flex-shrink-0" @click="deleteNoteAndRedirect"> Delete Note </Button>
        </div>
      </div>

      <section class="bg-primary-500 p-4 mb-6 rounded">
        <Field label="Title" stacked>
          <Input v-model="name" @update:model-value="save"></Input>
        </Field>
        <Field label="Description" stacked>
          <Input v-model="description" type="textarea" @update:model-value="save"></Input>
        </Field>
        <EncounterSelector
          v-model:expansion="expansion"
          v-model:instance="instance"
          v-model:encounter="encounter"
          @update:expansion="save"
          @update:instance="save"
          @update:encounter="save"
        ></EncounterSelector>
      </section>
      <section>
        <div class="md:grid grid-cols-12 gap-8">
          <div class="sm:col-span-12 md:col-span-6">
            <div class="flex justify-between">
              <Heading h2> General Tactic </Heading>
            </div>

            <Editor
              v-model="editor.value"
              class="block"
              @update:model-value="save"
              @update:json="editor.json = $event"
            />

            <TeamGroups class="mb-8" :note-id="note.id" />

            <TeamMembers />
          </div>
          <div class="sm:col-span-12 md:col-span-6">
            <NotePreview :note-json="editor.json" :note-string="editor.value" />
          </div>
        </div>
      </section>
    </Container>
  </Section>
</template>
