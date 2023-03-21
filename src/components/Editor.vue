<script lang="ts" setup>
import { EditorContent } from '@tiptap/vue-3'
import EditorSpellOccurranceModalButton from '~/components/EditorSpellOccurranceModalButton.vue'
import EditorTimeModalButton from '~/components/EditorTimeModalButton.vue'
import type { Member } from '~/types'
import { markers, wowColors } from '~/utils/config'
import { IMAGE_MARKER } from '~/utils/constants'
import { createEditorSpellIdImageData, useEditor } from '~/utils/editor'

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

const teamMembersStore = useTeamMembersStore()
const noteStore = useNoteStore()

const editor = useEditor(modelValue, emits)

function addImageToEditor({ src, alt, title }: { src: string; alt: string; title?: string }) {
  editor.value?.chain().focus().setImage({ src, alt, title }).run()
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

async function createSpellSnippet(spellName: string, imageData: { src: string; alt: string; title?: string }) {
  addImageToEditor(imageData)
  editor.value?.commands.insertContent(' ')
  editor.value?.commands.setMark('textStyle', {
    color: '#FFBB33',
  })
  editor.value?.commands.insertContent(spellName)
  editor.value?.commands.unsetMark('textStyle')
  editor.value?.commands.insertContent(' ')
  editor.value?.commands.focus()
}

function addStringToEditor(value: string) {
  editor.value?.commands.insertContent(value)
  editor.value?.commands.focus()
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
        @click.stop="addImageToEditor({ src: marker.src, alt: IMAGE_MARKER })"
      >
        <img class="object-contain w-full h-full" :src="marker.src" />
      </a>

      <EditorTimeModalButton @input="addStringToEditor"> Time </EditorTimeModalButton>
      <EditorSpellModalButton @input="addImageToEditor"> Spell ID </EditorSpellModalButton>
      <EditorSpellOccurranceModalButton @input="addStringToEditor"> Spell Occurrence </EditorSpellOccurranceModalButton>

      <button :disabled="!editor?.can().chain().focus().undo().run()" @click="editor?.chain().focus().undo().run()">
        <span class="text-xl i-carbon-undo inline-block mr-2" />
      </button>
      <button :disabled="!editor?.can().chain().focus().redo().run()" @click="editor?.chain().focus().redo().run()">
        <span class="text-xl i-carbon-redo inline-block mr-2" />
      </button>
      <button @click="editor?.chain().focus().clearNodes().unsetAllMarks().run()">
        <span class="text-xl i-carbon-text-clear-format text-white inline-block mr-2" />
      </button>
    </div>

    <div>
      <Field
        v-if="teamMembersStore.members.length"
        label="Players:"
        class="px-2 mt-2 !mb-2 flex-wrap lg:flex lg:flex-nowrap lg:items-start"
      >
        <div class="flex flex-wrap">
          <a
            v-for="teamMember in teamMembersStore.members"
            :key="teamMember.id"
            class="space-between cursor-pointer mr-1 mb-1 items-center bg-gray-900 hover:bg-black rounded px-2"
            :class="`has-wow-text-${teamMember.class.replace(' ', '-').toLowerCase()}`"
            @click.prevent="createPlayerSnippet(teamMember)"
          >
            {{ teamMember.name }}
          </a>
        </div>
      </Field>
    </div>
    <div>
      <Field
        key="encounter-spells"
        label="Encounter Spells: "
        class="px-2 !mb-2 !mb-0 flex-wrap lg:flex lg:flex-nowrap lg:items-start"
      >
        <div v-if="noteStore.spells" class="flex flex-wrap">
          <div
            v-for="spell in noteStore.spells"
            :key="`encounter-spells-${spell.id}`"
            class="flex space-between group cursor-pointer relative mr-1 mb-1 items-center bg-gray-900 hover:bg-black rounded px-2"
            @click="
              createSpellSnippet(spell.name, createEditorSpellIdImageData(spell.spellIdInformation.icon, spell.id))
            "
          >
            <img
              v-if="spell.spellIdInformation"
              class="w-4 h-4 mr-1"
              :src="`https://wow.zamimg.com/images/wow/icons/medium/${spell.spellIdInformation.icon}.jpg`"
              :alt="spell.spellIdInformation.name"
            />

            <span class="color-[#FFBB33]">{{ spell.name }}</span>

            <SpellInformation
              class="hidden !absolute top-100% left-0 group-hover:block w-100 !max-w-none"
              :icon="spell.spellIdInformation.icon"
              :tooltip="spell.spellIdInformation.tooltip"
              :show-icon="false"
            ></SpellInformation>
          </div>
        </div>
      </Field>
    </div>

    <div class="p-2 pt-0">
      <EditorContent class="editor-content" :editor="editor" />
    </div>
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
