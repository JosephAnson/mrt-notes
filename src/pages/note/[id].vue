<script lang='ts' setup>
import type { Group, Player, TemplateOption } from '~/types'
import { getNote } from '~/services/notes'
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

const groups = ref<Group[]>([])
const players = ref<Player[]>([])

function createSteps(type: TemplateOption) {
  switch (type) {
    case 'Starter':
      note.value
        = 'Fight summary\n\n\n'
          + 'All Phases\n\n\n'
          + 'Phase 1\n\n\n'
          + 'Phase 2\n\n\n'
          + 'Phase 3\n\n\n'
      break
    case 'Empty':
      note.value = ''
      break
  }
}

async function save() {

}
function loadNote() {}
function newNote() {}
async function copyNote() {}
</script>

<template>
  <Page>
    <Container>
      <div class="flex justify-between mb-4">
        <Heading>
          Ert Notes
        </Heading>

        <div>
          <Button @click="newNote">
            New Note
          </Button>

          <Button @click="save">
            Save
          </Button>
        </div>
      </div>

      <section id="ERT-Editor">
        <div class="grid grid-cols-12 gap-8">
          <div class="sm:col-span-12 md:col-span-6">
            <div class="flex justify-between">
              <h3 class="title is-4">
                Create
              </h3>

              <Field label="Template" horizontal>
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

            <Field label="General Tactic" class="mb-8">
              <Editor
                v-model="note.value"
                class="block"
                :players="players"
                @update:json="note.json = $event"
              />
            </Field>

            <TeamGroups v-model:groups="groups" class="mb-8" :players="players" />

            <TeamMembers />
          </div>
          <div class="sm:col-span-12 md:col-span-6">
            <NotePreview :note-json="note.json" :note-string="note.value" :groups="groups" />
          </div>
        </div>
      </section>
    </Container>
  </Page>
</template>
