<script lang="ts" setup>
import { EditorContent } from '@tiptap/vue-3'
import { useTeamMembers } from '~/composables/state'
import type { Member } from '~/types'
import type { Marker } from '~/utils/config'
import { markers, wowColors } from '~/utils/config'
import { useEditor } from '~/utils/editor'

const props = withDefaults(
  defineProps<{
    modelValue: string
  }>(),
  {
    modelValue: '',
  }
)

const emits = defineEmits(['update:modelValue', 'update:json'])

const { modelValue } = toRefs(props)

const teamMembers = useTeamMembers()
const isSpellOccurrenceModelActive = ref(false)
const isSpellIDModelActive = ref(false)
const isTimeSnippetModelActive = ref(false)
const time = ref('')
const spellID = ref('')
const spellOccurrence = reactive({
  timeAfterSpellStarted: '00:10',
  occurrence: 1,
  spellId: 306111,
})

const editor = useEditor(modelValue, emits)

function createMarker(marker: Marker) {
  editor.value?.chain().focus().setImage({ src: marker.src }).run()
}

async function createPlayerSnippet(player: Member) {
  const insertString = player.name

  editor.value?.commands.setMark('textStyle', {
    color: wowColors[player.class],
  })
  editor.value?.commands.insertContent(insertString)
  editor.value?.commands.unsetMark('textStyle')
  editor.value?.commands.insertContent(' ')
  editor.value?.commands.focus()
}

function createSpellSnippet(value: String) {
  openSnackbar(`Spell entered is: ${value}`)
  const insertString = `{spell:${value}}`

  editor.value?.commands.insertContent(insertString)
  editor.value?.commands.focus()

  time.value = ''
  isSpellIDModelActive.value = false
}

function createTimeSnippet(value: String) {
  openSnackbar(`Time entered is: ${value}`)

  editor.value?.commands.insertContent(`{time:${value}}`)
  editor.value?.commands.focus()

  time.value = ''
  isTimeSnippetModelActive.value = false
}

function createSpellOccurrenceSnippet() {
  const insertString = `{time:${spellOccurrence.timeAfterSpellStarted},SCS:${spellOccurrence.spellId}:${spellOccurrence.occurrence}}`

  openSnackbar(`Snippet entered is: ${insertString}`)

  editor.value?.commands.insertContent(insertString)
  editor.value?.commands.focus()

  isSpellOccurrenceModelActive.value = false
}

function setColor(event: Event) {
  editor.value
    ?.chain()
    .focus()
    .setColor((event.target as HTMLInputElement).value)
    .run()
}
</script>

<template>
  <div class="editor bg-gray-800 rounded mb-4">
    <div class="toolbar flex flex-wrap p-2 bg-gray-700">
      <div class="relative">
        <input
          class="absolute top-0 left-0 w-full h-full opacity-0"
          type="color"
          :value="editor?.getAttributes('textStyle').color"
          @input="setColor"
        />
        <span
          class="i-carbon-text-color text-3xl inline-block pointer-events-none"
          :style="{ color: editor?.getAttributes('textStyle').color }"
        />
      </div>
      <a
        v-for="marker in markers"
        :key="marker.name"
        class="h-6 w-6 flex items-center cursor-pointer mr-1 last:mr-0"
        @click.stop="createMarker(marker)"
      >
        <img class="object-contain w-full h-full" :src="marker.src" />
      </a>

      <a class="mr-2" href="#" @click.stop="isTimeSnippetModelActive = true">
        Time
      </a>
      <a class="mr-2" href="#" @click.stop="isSpellIDModelActive = true">
        Spell ID
      </a>
      <a class="mr-2" href="#" @click="isSpellOccurrenceModelActive = true">
        Spell Occurrence
      </a>

      <button
        :disabled="!editor?.can().chain().focus().undo().run()"
        @click="editor?.chain().focus().undo().run()"
      >
        <span class="text-xl i-carbon-undo inline-block mr-2" />
      </button>
      <button
        :disabled="!editor?.can().chain().focus().redo().run()"
        @click="editor?.chain().focus().redo().run()"
      >
        <span class="text-xl i-carbon-redo inline-block mr-2" />
      </button>
      <button
        @click="editor?.chain().focus().clearNodes().unsetAllMarks().run()"
      >
        <span
          class="text-xl i-carbon-text-clear-format text-white inline-block mr-2"
        />
      </button>
    </div>

    <Field
      v-if="teamMembers.length"
      label="Players:"
      class="p-2 !mb-0 flex-wrap lg:flex lg:flex-nowrap lg:items-start"
    >
      <div class="flex flex-wrap">
        <a
          v-for="teamMember in teamMembers"
          :key="teamMember.id"
          class="mr-2 last:mr-0 cursor-pointer"
          :class="`has-wow-text-${teamMember.class
            .replace(' ', '-')
            .toLowerCase()}`"
          @click.prevent="createPlayerSnippet(teamMember)"
        >
          {{ teamMember.name }}
        </a>
      </div>
    </Field>

    <div class="p-2 pt-0">
      <EditorContent class="editor-content" :editor="editor" />
    </div>

    <Modal v-model:active="isSpellIDModelActive">
      <SpellIdInput v-model="spellID" />

      <footer>
        <Button class="mr-2" @click="isSpellIDModelActive = false">
          Cancel
        </Button>
        <Button @click="createSpellSnippet(spellID)"> Done </Button>
      </footer>
    </Modal>

    <Modal v-model:active="isTimeSnippetModelActive">
      <Field label="Enter a time?" stacked>
        <Input v-model="time" placeholder="e.g. 10:00" />
      </Field>

      <footer>
        <Button class="mr-2" @click="isTimeSnippetModelActive = false">
          Cancel
        </Button>
        <Button @click="createTimeSnippet(time)"> Done </Button>
      </footer>
    </Modal>

    <Modal v-model:active="isSpellOccurrenceModelActive">
      <SpellIdInput v-model="spellOccurrence.spellId" />

      <Field label="Enter the Time after spell cast? {00:10}" stacked>
        <Input v-model="spellOccurrence.timeAfterSpellStarted" />
      </Field>

      <Field label="Enter the cast number?" stacked>
        <Input v-model="spellOccurrence.occurrence" />
      </Field>

      <footer>
        <Button class="mr-2" @click="isSpellOccurrenceModelActive = false">
          Cancel
        </Button>
        <Button @click="createSpellOccurrenceSnippet"> Done </Button>
      </footer>
    </Modal>
  </div>
</template>

<style lang="scss">
.editor-content {
  background: #eee;
  color: black;
  border-radius: 2px;

  .ProseMirror {
    min-height: 10rem;
    padding: 0.5rem;
  }

  img {
    display: inline-block;

    &.ProseMirror-selectednode {
      outline: 3px solid #68cef8;
    }
  }
}

.input-color {
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
  }
}
</style>
