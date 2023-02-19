<script lang='ts' setup>
import type { EditorData } from '~/types'
import { deleteNote, getNote, updateNote } from '~/services/notes'
import { getRouterParamsAsString } from '~/utils/getRouterParamsAsString'

definePageMeta({
  middleware: 'auth',
})

const { data: note } = await useAsyncData('notes', async () => {
  const route = useRoute()
  const { data } = await getNote(getRouterParamsAsString(route.params.id))
  return data
})

const groups = useGroups()

const name = ref(note.value?.name || '')
const editor = reactive<EditorData>({
  value: note.value?.editor_string || '',
  json: {},
})

const debouncedUpdateNote = useDebounceFn(() => {
  if (note.value)
    updateNote(note.value.id, name.value, editor.value)
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
        <Heading h1>
          Ert Notes
        </Heading>

        <div class="flex">
          <Input v-model="name" class="mr-2" @change="debouncedUpdateNote" />
          <Button class="bg-red-700 flex-shrink-0" @click="deleteNoteAndRedirect">
            Delete Note
          </Button>
        </div>
      </div>

      <section>
        <div class="md:grid grid-cols-12 gap-8">
          <div class="sm:col-span-12 md:col-span-6">
            <div class="flex justify-between">
              <Heading h2>
                General Tactic
              </Heading>
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
            <NotePreview :note-json="editor.json" :note-string="editor.value" :groups="groups" />
          </div>
        </div>
      </section>
    </Container>
  </Page>
</template>
