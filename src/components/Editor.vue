<script lang='ts'>
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import type { PropType } from '@vue/runtime-core'
import Image from '@tiptap/extension-image'
import type { Marker } from '~/utils/config'
import { markers, wowColors } from '~/utils/config'
import type { Player } from '~/types'
import { defineComponent, watch } from '#imports'
import DialogProgrammatic from '~/components/Programatic/DialogProgramatic'
import SnackbarProgrammatic from '~/components/Programatic/SnackbarProgramatic'

export default defineComponent({
  components: {
    EditorContent,
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    players: { type: Array as PropType<Player[]>, default: () => [] },
  },
  emits: ['update:modelValue', 'update:json'],
  setup(props, { emit }) {
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
      onUpdate: () => {
        emit('update:modelValue', editor.value?.getHTML())
        emit('update:json', editor.value?.getJSON())
      },
    })

    watch(() => props.modelValue, value => setContent(value))

    function setContent(value: string) {
      if (value === editor.value?.getHTML())
        return

      editor.value?.commands.setContent(value, false)
    }

    function createMarker(marker: Marker) {
      editor.value?.chain().focus().setImage({ src: marker.src }).run()
    }

    async function createPlayerSnippet(player: Player) {
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
  <div>
    <input
      type="color"
      :value="editor?.getAttributes('textStyle').color"
      @input="editor?.chain().focus().setColor($event.target.value).run()"
    >
    <Button
      v-for="marker in markers"
      :key="marker.name"
      class="ql-button" :class="[`ql-${marker.name}`]"
      @click.stop="createMarker(marker)"
    />
    <button :disabled="!editor?.can().chain().focus().undo().run()" @click="editor?.chain().focus().undo().run()">
      undo
    </button>
    <button :disabled="!editor?.can().chain().focus().redo().run()" @click="editor?.chain().focus().redo().run()">
      redo
    </button>
    <div class="block is-small">
      <Field v-if="players.length">
        <div class="control box is-black is-small content">
          <a
            v-for="player in players"
            :key="player.id"
            :class="
              `has-wow-text-${player.class.replace(' ', '-').toLowerCase()}`
            "
            @click.prevent="createPlayerSnippet(player)"
          >
            {{ player.name }}
          </a>
        </div>
      </Field>
    </div>
    <Button @click.stop="createTimeSnippet">
      Time Snippet
    </Button>
    <Button @click.stop="createSpellSnippet">
      Spell Snippet
    </Button>
    <Button @click="openSpellOccurrenceDialog">
      Spell Occurrence
    </Button>

    <Modal
      v-model:active="isComponentModalActive"
      has-modal-card
      trap-focus
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
    <EditorContent class="editor" :editor="editor" />
  </div>
</template>

<style lang='scss'>
.editor {
  background: white;
  color: black;
  border-radius: 2px;

  .ProseMirror {
    min-height: 6rem;
  }

  span {
    color: black !important;
  }

  img {
    display: inline-block;

    &.ProseMirror-selectednode {
      outline: 3px solid #68CEF8;
    }
  }
}
</style>
