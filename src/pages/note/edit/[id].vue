<script lang="ts" setup>
import { generateJSON } from '@tiptap/html'
import type { EditorData, Node } from '~/types'
import { flattenedNoteCategories } from '~/utils/constants'

definePageMeta({
  middleware: 'note-edit',
})

const { data: note } = await useAsyncData('notes', async () => {
  const route = useRoute()
  const { data } = await getNote(getRouterParamsAsString(route.params.id))
  return data
})

const groups = useGroups()

const selectedCategoryList = flattenedNoteCategories?.filter((category) =>
  note.value?.categories?.includes(category.id)
)

const name = ref(note.value?.name || '')
const saving = ref(false)
const description = ref(note.value?.description || '')
const categories = ref<Node[]>(selectedCategoryList)
const categoryIds = computed<string[]>(() =>
  categories.value.map((category) => category.id)
)

const editor = reactive<EditorData>({
  value: note.value?.editor_string || '',
  json: generateJSON(note.value?.editor_string || '', editorExtensions),
})

const debouncedUpdateNote = useDebounceFn(() => {
  if (note.value) {
    updateNote({
      id: note.value.id,
      name: name.value,
      description: description.value,
      editor_string: editor.value,
      categories: categoryIds.value,
    })
    saving.value = false
  }
}, 2000)

function save() {
  saving.value = true
  debouncedUpdateNote()
}

async function deleteNoteAndRedirect() {
  if (note.value) {
    const router = useRouter()
    await deleteNote(note.value.id)
    router.push('/')
  }
}
</script>

<template>
  <Section>
    <Container v-if="note">
      <div class="flex justify-between mb-4">
        <Heading h1> Mrt Notes </Heading>

        <div class="flex items-center">
          <div v-if="saving" class="flex item-center mr-4">
            <p class="mr-4">Saving</p>
            <div class="i-carbon-catalog animate-spin h-6 w-6"></div>
          </div>
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
          <Input v-model="name" @update:model-value="save"></Input>
        </Field>
        <Field label="Description" stacked>
          <Input
            v-model="description"
            type="textarea"
            @update:model-value="save"
          ></Input>
        </Field>
        <Field label="Tags" stacked>
          <NoteCategories
            v-model="categories"
            @update:model-value="save"
          ></NoteCategories>
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
              @update:model-value="save"
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
  </Section>
</template>
