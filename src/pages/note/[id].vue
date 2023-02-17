<script lang='ts' setup>
import type { JSONContent } from '@tiptap/vue-3'
import type { Guid } from '~/shared/guid'
import type { Group, Player, TemplateOption } from '~/types'
import type { Database } from '~/supabase.types'
import { definePageMeta, reactive, useSupabaseClient } from '#imports'

const templateOption: TemplateOption = 'Default'
const templateOptions: TemplateOption[] = ['Default', 'Empty']

const client = useSupabaseClient<Database>()

definePageMeta({
  middleware: 'auth',
})

const editor = reactive<{
  value: string
  json: JSONContent
}>({
  value: '',
  json: {},
})

const groups = ref<Group[]>([])
const players = ref<Player[]>([])

function createSteps(type: TemplateOption) {
  switch (type) {
    case 'Default':
      editor.value
        = 'Fight summary\n\n\n'
          + 'All Phases\n\n\n'
          + 'Phase 1\n\n\n'
          + 'Phase 2\n\n\n'
          + 'Phase 3\n\n\n'
      break
    case 'Empty':
      editor.value = ''
      break
  }
}

async function saveData(id: Guid) {

}

function loadNote() {}
function newNote() {

}

async function copyNote() {

}
</script>

<template>
  <div class="page-homepage section">
    <section id="ERT-Editor" class="container">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <h3 class="title is-4">
              Ert Notes
            </h3>
          </div>
          <div class="level-item">
            <Button type="is-primary" @click="newNote">
              New Note
            </Button>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <Field class="editor-load-note">
              <Input
                icon-pack="fa"
                icon-right="copy"
                icon-right-clickable
              />
              <Button type="is-primary" @click="loadNote">
                Load Note
              </Button>
            </Field>
          </div>
          <div class="level-item">
            <div class="buttons">
              <Button type="is-primary" @click="copyNote">
                Copy Note
              </Button>
            </div>
          </div>
          <div class="level-item">
            <div class="buttons">
              <Button type="is-primary" @click="saveData(id)">
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column is-6">
          <div class="level">
            <div class="level-left">
              <h3 class="title is-4">
                Create
              </h3>
            </div>
            <div class="level-right">
              <Field label="Template" horizontal>
                <Select v-model:value="templateOption" @input="createSteps">
                  <option
                    v-for="(option, key) in templateOptions"
                    :key="option"
                    :value="option"
                  >
                    {{ key }}
                  </option>
                </Select>
              </Field>
            </div>
          </div>
          <div class="note__editor box is-light">
            <Field label="General Tactic">
              <Editor
                v-model="editor.value"
                class="block"
                :players="players"
                @update:json="editor.json = $event"
              />
            </Field>

            <TeamGroups v-model:groups="groups" :players="players" />

            <TeamMembers v-model:players="players" class="box" />
          </div>
        </div>
        <div class="column is-6 is-relative mb-10">
          <EditorPreview :editor-json="editor.json" :editor-string="editor.value" :groups="groups" />
        </div>
      </div>
      <div class="columns">
        <div class="column is-6">
          <div class="notification is-warning">
            Save the note and share the url to work on it together, must refresh
            page to see new changes
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
