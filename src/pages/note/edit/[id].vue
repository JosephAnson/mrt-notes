<script lang="ts" setup>
import { generateJSON } from '@tiptap/html'
import type { EditorData } from '~/types'

definePageMeta({
  middleware: 'note-edit',
})

const { data: note } = await useAsyncData('notes', async () => {
  const route = useRoute()
  const { data } = await getNote(getRouterParamsAsString(route.params.id))
  return data
})

const groups = useGroups()

const name = ref(note.value?.name || '')
const description = ref(note.value?.description || '')

const editor = reactive<EditorData>({
  value: note.value?.editor_string || '',
  json: generateJSON(note.value?.editor_string || '', editorExtensions),
})

const debouncedUpdateNote = useDebounceFn(() => {
  if (note.value)
    updateNote(note.value.id, name.value, description.value, editor.value)
}, 2000)

async function deleteNoteAndRedirect() {
  if (note.value) {
    const router = useRouter()
    await deleteNote(note.value.id)
    router.push('/')
  }
}
</script>

<template>
  <Page>
    <Container>
      <div class="flex justify-between mb-4">
        <Heading h1> Mrt Notes </Heading>

        <div class="flex">
          <Button
            class="bg-red-700 flex-shrink-0"
            @click="deleteNoteAndRedirect"
          >
            Delete Note
          </Button>
        </div>
      </div>

      <section class="bg-primary-500 p-4 mb-4 rounded">
        <Field label="Title" stacked>
          <Input
            v-model="name"
            @update:model-value="debouncedUpdateNote"
          ></Input>
        </Field>
        <Field label="Description" stacked>
          <Input
            v-model="description"
            type="textarea"
            @update:model-value="debouncedUpdateNote"
          ></Input>
        </Field>
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
              @update:model-value="debouncedUpdateNote"
              @update:json="editor.json = $event"
            />

            <TeamGroups class="mb-8" :note-id="note.id" />

            <TeamMembers />
          </div>
          <div class="sm:col-span-12 md:col-span-6">
            <NotePreview
              :note-json="editor.json"
              :note-string="editor.value"
              :groups="groups"
            />
          </div>
        </div>
      </section>
    </Container>
  </Page>
</template>