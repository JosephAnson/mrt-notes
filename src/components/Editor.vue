<script lang='ts'>
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Image from '@tiptap/extension-image'
import type { Marker } from '~/utils/config'
import { markers, wowColors } from '~/utils/config'
import type { Member } from '~/types'
import DialogProgrammatic from '~/components/Programatic/DialogProgramatic'
import SnackbarProgrammatic from '~/components/Programatic/SnackbarProgramatic'
import { useTeamMembers } from '~/composables/state'

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
    const teamMembers = useTeamMembers()
    const isComponentModalActive = ref(false)

    const spellOccurrence = reactive({
      timeAfterSpellStarted: '00:10',
      occurrence: 1,
      spellId: 306111,
    })

    const editor = useEditor({
      content: props.modelValue,
      extensions: [
        StarterKit,
        Image.configure({
          inline: true,
        }),
        Color,
        TextStyle,
      ],
      onCreate: () => {
        emit('update:json', editor.value?.getJSON())
      },
      onUpdate: () => {
        emit('update:modelValue', editor.value?.getHTML())
        emit('update:json', editor.value?.getJSON())
      },
    })

    watch(() => props.modelValue, value => setContent(value))

    function setContent(value: string) {
      if (value === editor.value?.getHTML())
        return

      editor.value?.commands.setContent(value, false, { preserveWhitespace: 'full' })
      emit('update:json', editor.value?.getJSON())
    }

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
      <input
        class="p-0 border-0 mr-2"
        type="color"
        :value="editor?.getAttributes('textStyle').color"
        @input="editor?.chain().focus().setColor($event.target.value).run()"
      >
      <a
        v-for="marker in markers"
        :key="marker.name"
        class="h-6 w-6 flex items-center cursor-pointer mr-2 last:mr-0"
        @click.stop="createMarker(marker)"
      >
        <img class="object-contain w-full h-full" :src="marker.src">
      </a>

      <button :disabled="!editor?.can().chain().focus().undo().run()" @click="editor?.chain().focus().undo().run()">
        <span class="i-carbon-undo" />
      </button>
      <button :disabled="!editor?.can().chain().focus().redo().run()" @click="editor?.chain().focus().redo().run()">
        <span class="i-carbon-redo" />
      </button>
      <button
        :disabled="!editor?.can().chain().focus().clearNodes().unsetAllMarks().run()"
        @click="editor?.chain().focus().clearNodes().unsetAllMarks().run()"
      >
        <span class="i-carbon-text-clear-format text-white" />
      </button>

      <a class="mr-2" href="#" @click.stop="createTimeSnippet">
        Time
      </a>
      <a class="mr-2" href="#" @click.stop="createSpellSnippet">
        Spell ID
      </a>
      <a class="mr-2" href="#" @click="openSpellOccurrenceDialog">
        Spell Occurrence
      </a>
    </div>

    <Field v-if="teamMembers.length" label="Players:" class="p-2 !mb-0">
      <a
        v-for="teamMember in teamMembers"
        :key="teamMember.id"
        class="mr-2 last:mr-0 cursor-pointer"
        :class="
          `has-wow-text-${teamMember.class.replace(' ', '-').toLowerCase()}`
        "
        @click.prevent="createPlayerSnippet(teamMember)"
      >
        {{ teamMember.name }}
      </a>
    </Field>

    <div class="p-2 pt-0">
      <EditorContent class="editor-content" :editor="editor" />
    </div>
    <Modal
      v-model:active="isComponentModalActive"
      has-modal-card
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-modal
    >
      <div class="modal-card animation-content">
        <section class="modal-card-body is-titleless">
          <div class="media">
            <div class="media-content">
              <Field label="Enter the Time after spell cast? {00:10}">
                <Input
                  v-model="spellOccurrence.timeAfterSpellStarted"
                />
              </Field>
              <Field label="Enter the spell id?">
                <Input
                  v-model="spellOccurrence.spellId"
                  icon-pack="fa"
                />
              </Field>
              <Field label="Enter the cast number?">
                <Input
                  v-model="spellOccurrence.occurrence"
                  icon-pack="fa"
                />
              </Field>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button" @click="isComponentModalActive = false">
            Cancel
          </button>
          <button
            class="button is-primary"
            @click="createSpellOccurrenceSnippet"
          >
            Done
          </button>
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
</style>
