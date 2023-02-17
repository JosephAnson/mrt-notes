<script lang='ts' setup>
import type { Group, Member, Note, TemplateOption } from '~/types'
import { getNote, updateNote } from '~/services/notes'
import { getRouterParamsAsString } from '~/utils/getRouterParamsAsString'

const templateOption: TemplateOption = 'Empty'
const templateOptions: TemplateOption[] = ['Empty', 'Starter']

definePageMeta({
  middleware: 'auth',
})

const { data: note } = await useAsyncData('notes', async () => {
  const route = useRoute()
  const { data } = await getNote(getRouterParamsAsString(route.params.id))
  return data
})

const name = ref(note.value?.name || '')

const editor = reactive<Note>({
  value: note.value?.editor_string || '',
  json: {},
})
const groups = ref<Group[]>([])
const players = ref<Member[]>([])

const debouncedUpdateNote = useDebounceFn(() => {
  if (note.value)
    updateNote(note.value.id, name.value, editor.value)
}, 2000)

function createSteps(type: TemplateOption) {
  switch (type) {
    case 'Starter':
      editor.value
        = 'Fight summary<br><br><br>'
          + 'All Phases<br><br><br>'
          + 'Phase 1<br><br><br>'
          + 'Phase 2<br><br><br>'
          + 'Phase 3<br><br><br>'
      break
    case 'Empty':
      editor.value = ''
      break
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
        </div>
      </div>

      <section id="ERT-Editor">
        <div class="grid grid-cols-12 gap-8">
          <div class="sm:col-span-12 md:col-span-6">
            <div class="flex justify-between">
              <Heading h2>
                General Tactic
              </Heading>

              <Field label="Template">
                <Select v-model:value="templateOption" @update:value="createSteps">
                  <option
                    v-for="(option) in templateOptions"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </Select>
              </Field>
            </div>

            <Editor
              v-model="editor.value"
              class="block"
              :players="players"
              @update:model-value="debouncedUpdateNote"
              @update:json="editor.json = $event"
            />

            <TeamGroups v-model:groups="groups" class="mb-8" :players="players" />

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
