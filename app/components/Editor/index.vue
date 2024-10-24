<script lang="ts" setup>
import { EditorContent } from '@tiptap/vue-3'
import PlayerTags from '~/components/PlayerTags.vue'
import type { Member } from '~/types'
import { markers, wowColors } from '~/utils/config'
import { IMAGE_MARKER } from '~/utils/constants'
import { createEditorSpellIdImageData, useEditor } from '~/utils/editor'

const props = withDefaults(
  defineProps<{
    modelValue: string
    encounter?: number | null
    members?: Member[]
  }>(),
  {
    modelValue: '',
    members: () => [],
  },
)

const emits = defineEmits(['update:modelValue', 'update:json'])

const { pending: spellsLoading, data: encounterInfo } = await useFetch(() => `/api/blizzard/encounter/spells/${props.encounter}`)

const { modelValue } = toRefs(props)

const editor = useEditor(modelValue, emits)

function addImageToEditor({ src, alt, title }: { src: string, alt: string, title?: string }) {
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

async function createSpellSnippet(spellName: string, imageData: { src: string, alt: string, title?: string }) {
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
  <div class="editor h-full">
    <div class="flex flex-col h-full">
      <div>
        <div class="toolbar flex flex-wrap p-1 bg-white/10 gap-1">
          <EditorToolbarButton class="relative of-hidden">
            <input
              class="absolute top-0 left-0 w-full h-full opacity-0"
              type="color"
              :value="editor?.getAttributes('textStyle').color"
              @input="setColor"
            >
            <Icon
              name="carbon:text-color"
              class="inline-block pointer-events-none"
              :style="{ color: editor?.getAttributes('textStyle').color }"
            />
          </EditorToolbarButton>
          <EditorToolbarButton
            v-for="marker in markers"
            :key="marker.name"
            @click.stop="addImageToEditor({ src: marker.src, alt: IMAGE_MARKER })"
          >
            <img class="object-contain w-full h-full" :src="marker.src">
          </EditorToolbarButton>

          <EditorTimeModalButton @input="addStringToEditor">
            Time
          </EditorTimeModalButton>
          <EditorSpellModalButton @input="addImageToEditor">
            Spell ID
          </EditorSpellModalButton>
          <EditorSpellOccurranceModalButton @input="addStringToEditor">
            Spell Occurrence
          </EditorSpellOccurranceModalButton>

          <EditorToolbarButton :disabled="!editor?.can().chain().focus().undo().run()" @click="editor?.chain().focus().undo().run()">
            <Icon name="carbon:undo" class="text-xl" />
          </EditorToolbarButton>
          <EditorToolbarButton :disabled="!editor?.can().chain().focus().redo().run()" @click="editor?.chain().focus().redo().run()">
            <Icon name="carbon:redo" class="text-xl" />
          </EditorToolbarButton>
          <EditorToolbarButton @click="editor?.chain().focus().clearNodes().unsetAllMarks().run()">
            <Icon name="carbon:text-clear-format" class="text-xl" />
          </EditorToolbarButton>
        </div>

        <BaseField
          v-if="members?.length"
          label="Players:"
          class="p-2 mb-0 bg-white/5"
        >
          <PlayerTags :members="members" @click="createPlayerSnippet" />
        </BaseField>

        <div class="p-1">
          <Loading v-if="spellsLoading">
            Spells Loading
          </Loading>
          <BaseField
            v-else-if="encounterInfo?.spells?.length"
            key="encounter-spells"
            label="Encounter Spells: "
            sr-only
            class="mb-0"
          >
            <div v-if="encounterInfo?.spells" class="flex flex-wrap">
              <div
                v-for="spell in encounterInfo?.spells"
                :key="`encounter-spells-${spell.id}`"
                class="flex space-between group cursor-pointer relative mr-1 mb-1 items-center bg-white/10 hover:bg-black rounded px-2"
                @click="
                  createSpellSnippet(spell.name, createEditorSpellIdImageData(spell.spellIdInformation.icon, spell.id))
                "
              >
                <img
                  v-if="spell.spellIdInformation"
                  class="w-4 h-4 mr-1"
                  :src="`https://wow.zamimg.com/images/wow/icons/medium/${spell.spellIdInformation.icon}.jpg`"
                  :alt="spell.spellIdInformation.name"
                >

                <span class="text-[#FFBB33]">{{ spell.name }}</span>

                <SpellInformation
                  class="hidden !absolute top-100% left-0 group-hover:block w-100 !max-w-none"
                  :icon="spell.spellIdInformation.icon"
                  :tooltip="spell.spellIdInformation.tooltip"
                  :show-icon="false"
                />
              </div>
            </div>
          </BaseField>
        </div>
      </div>
      <div class="pt-0 h-full">
        <EditorContent class="editor-content mb-0 bg-white h-full" :editor="editor" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.editor-content {
  color: black;

  .ProseMirror {
    min-height: 10rem;
    height: 100%;
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
