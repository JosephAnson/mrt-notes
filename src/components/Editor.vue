<script lang='ts'>
import { EditorContent } from '@tiptap/vue-3'
import type { Marker } from '~/utils/config'
import { markers, wowColors } from '~/utils/config'
import type { Member } from '~/types'
import DialogProgrammatic from '~/components/Programatic/DialogProgramatic'
import SnackbarProgrammatic from '~/components/Programatic/SnackbarProgramatic'
import { useTeamMembers } from '~/composables/state'
import { useEditor } from '~/utils/editor'

export default defineComponent({
  components: {
    EditorContent,
  },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'update:json'],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props)
    const teamMembers = useTeamMembers()
    const isComponentModalActive = ref(false)

    const spellOccurrence = reactive({
      timeAfterSpellStarted: '00:10',
      occurrence: 1,
      spellId: 306111,
    })

    const editor = useEditor(modelValue, emit)

    function createMarker(marker: Marker) {
      editor.value?.chain().focus().setImage({ src: marker.src }).run()
    }

    async function createPlayerSnippet(player: Member) {
      const insertString = player.name

      editor.value?.commands.setMark('textStyle', { color: wowColors[player.class] })
      editor.value?.commands.insertContent(insertString)
      editor.value?.commands.unsetMark('textStyle')
      editor.value?.commands.insertContent(' ')
      editor.value?.commands.focus()
    }

    function createTimeSnippet() {
      DialogProgrammatic.prompt({
        message: 'Enter a time?',
        inputAttrs: {
          placeholder: 'e.g. 10:00',
        },
        onConfirm: (value: string) => {
          SnackbarProgrammatic.open(`Time entered is: ${value}`)

          editor.value?.commands.insertContent(`{time:${value}}`)
          editor.value?.commands.focus()
        },
      })
    }

    function createSpellSnippet() {
      DialogProgrammatic.prompt({
        message: 'Enter a spell id:',
        inputAttrs: {
          placeholder: 'Add in a spell id',
        },
        onConfirm: (value: string) => {
          SnackbarProgrammatic.open(`Spell entered is: ${value}`)
          const insertString = `{spell:${value}}`

          editor.value?.commands.insertContent(insertString)
          editor.value?.commands.focus()
        },
      })
    }

    function openSpellOccurrenceDialog() {
      isComponentModalActive.value = true
    }

    function createSpellOccurrenceSnippet() {
      SnackbarProgrammatic.open(
        `Snippet entered is: {time:0:30,SCS:${spellOccurrence.spellId}:${spellOccurrence.occurrence}}`,
      )
      const insertString = `{time:${spellOccurrence.timeAfterSpellStarted},SCS:${spellOccurrence.spellId}:${spellOccurrence.occurrence}}`

      editor.value?.commands.insertContent(insertString)
      editor.value?.commands.focus()

      isComponentModalActive.value = false
    }

    return {
      editor,
      isComponentModalActive,
      spellOccurrence,
      teamMembers,
      markers,
      openSpellOccurrenceDialog,
      createMarker,
      createPlayerSnippet,
      createTimeSnippet,
      createSpellSnippet,
      createSpellOccurrenceSnippet,
    }
  },
})
</script>

<template>
  <div class="editor bg-gray-800 rounded mb-4">
    <div class="toolbar flex flex-wrap p-2 bg-gray-700">
      <div class="relative">
        <input class="absolute top-0 left-0 w-full h-full opacity-0" type="color"
          :value="editor?.getAttributes('textStyle').color"
          @input="editor?.chain().focus().setColor($event.target.value).run()">
        <span class="i-carbon-text-color text-3xl inline-block pointer-events-none"
          :style="{ color: editor?.getAttributes('textStyle').color }" />
      </div>
      <a v-for="marker in markers" :key="marker.name" class="h-6 w-6 flex items-center cursor-pointer mr-1 last:mr-0"
        @click.stop="createMarker(marker)">
        <img class="object-contain w-full h-full" :src="marker.src">
      </a>

      <a class="mr-2" href="#" @click.stop="createTimeSnippet">
        Time
      </a>
      <a class="mr-2" href="#" @click.stop="createSpellSnippet">
        Spell ID
      </a>
      <a class="mr-2" href="#" @click="openSpellOccurrenceDialog">
        Spell Occurrence
      </a>

      <button :disabled="!editor?.can().chain().focus().undo().run()" @click="editor?.chain().focus().undo().run()">
        <span class="text-xl i-carbon-undo  inline-block  mr-2" />
      </button>
      <button :disabled="!editor?.can().chain().focus().redo().run()" @click="editor?.chain().focus().redo().run()">
        <span class="text-xl i-carbon-redo  inline-block  mr-2" />
      </button>
      <button @click="editor?.chain().focus().clearNodes().unsetAllMarks().run()">
        <span class="text-xl i-carbon-text-clear-format text-white  inline-block  mr-2" />
      </button>
    </div>

    <Field v-if="teamMembers.length" label="Players:" class="p-2 !mb-0 flex-wrap lg:flex lg:flex-nowrap lg:items-start">
      <div class="flex flex-wrap">
        <a v-for="teamMember in teamMembers" :key="teamMember.id" class="mr-2 last:mr-0 cursor-pointer" :class="
          `has-wow-text-${teamMember.class.replace(' ', '-').toLowerCase()}`"
          @click.prevent="createPlayerSnippet(teamMember)">
          {{ teamMember.name }}
        </a>
      </div>
    </Field>

    <div class="p-2 pt-0">
      <EditorContent class="editor-content" :editor="editor" />
    </div>
    <Modal v-model:active="isComponentModalActive" has-modal-card :destroy-on-hide="false" aria-role="dialog" aria-modal>
      <div class="modal-card animation-content">
        <section class="modal-card-body is-titleless">
          <div class="media">
            <div class="media-content">
              <Field label="Enter the Time after spell cast? {00:10}" stacked>
                <Input v-model="spellOccurrence.timeAfterSpellStarted" />
              </Field>
              <Field label="Enter the spell id?" stacked>
                <Input v-model="spellOccurrence.spellId" />
              </Field>
              <Field label="Enter the cast number?" stacked>
                <Input v-model="spellOccurrence.occurrence" />
              </Field>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <Button class="button mr-2" @click="isComponentModalActive = false">
            Cancel
          </Button>
          <Button class="button is-primary" @click="createSpellOccurrenceSnippet">
            Done
          </Button>
        </footer>
      </div>
    </Modal>
  </div>
</template>

<style lang='scss'>
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
      outline: 3px solid #68CEF8;
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
