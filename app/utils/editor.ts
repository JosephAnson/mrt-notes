import type { Node, Slice } from '@tiptap/pm/model'
import type { Editor, JSONContent } from '@tiptap/vue-3'
import type { Ref } from 'vue'
import type { SpellIdInformation } from '~/types'
import { Color } from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import TextStyle from '@tiptap/extension-text-style'
import { Fragment } from '@tiptap/pm/model'
import StarterKit from '@tiptap/starter-kit'
import { useEditor as tiptapUseEditor } from '@tiptap/vue-3'
import { toast } from 'vue-sonner'
import { convertRgbColorsToHex } from '~/utils/convertRgbColorsToHex'
import { IMAGE_MARKER, IMAGE_SPELLID } from './constants'

export function createEditorSpellIdImageData(icon: string, spellId: string | number) {
  return {
    src: `https://wow.zamimg.com/images/wow/icons/small/${icon}.jpg`,
    alt: IMAGE_SPELLID,
    title: `{spell:${spellId}}`,
  }
}

export function convertSliceToHex(text: Slice | Node) {
  text.content?.forEach((item) => {
    if (item.marks[0]?.attrs?.color) {
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      // Value can be set, ignore type issue
      item.marks[0].attrs.color = convertRgbColorsToHex(item.marks[0]?.attrs?.color)
    }

    convertSliceToHex(item)
  })

  return text
}

export function convertJsonContentToHex(content: JSONContent) {
  content.content?.forEach((item: JSONContent) => {
    if (item.marks?.[0]?.attrs?.color)
      item.marks[0].attrs.color = convertRgbColorsToHex(item.marks[0]?.attrs?.color)

    convertJsonContentToHex(item)
  })

  return content
}

function createTextNode(editor: Editor, text: string, { color }: { color?: string } = {}) {
  const marks = []

  if (color) marks.push(editor.schema.marks.textStyle.create({ color }))

  return editor.schema.text(text, marks)
}

function createImageNode({ editor, src, alt, title }: { editor: Editor, src: string, alt: string, title?: string }) {
  return editor.schema.nodes.image.create({ src, alt, title })
}

function isMarker(string: string) {
  return markers.find(marker => marker.name === string.slice(1, -1))
}

function isSpell(string: string) {
  return string.includes('spell:')
}

const VALID_TAGS = [
  'text',
  '/text',
  'potion',
  'everyone',
  'tank',
  '/tank',
  'healer',
  '/healer',
  'h',
  '/h',
  't',
  '/t',
  'p1',
  'p1.5',
  'p2',
  'p2.5',
  'p3',
  'p3.5',
  'p4',
  'p4.5',
  'p5',
  '/p',
  'g135',
  'g246',
  '/g',
]

function isValidTag(string: any) {
  if (string.includes('time:')) return true

  return VALID_TAGS.includes(string.toLowerCase())
}

export async function createNodesOnPaste(editor: Editor, content: Slice | Node) {
  const jsonContent: Node[] = []
  const nodeList: Node[] = []

  content.content?.forEach((item: Node) => {
    nodeList.push(item)
  })

  for (const item of nodeList) {
    const regex
      = /(\{skull\}|\{cross\}|\{circle\}|\{star\}|\{square\}|\{triangle\}|\{diamond\}|\{moon\})|\{([\s\S]+?)\}|\|cff([\s\S]+?)\|r|\|cF3([\s\S]+?)\|r/gi
    const splitText = item.text?.split(regex)

    if (splitText && splitText.length > 1) {
      for (const string of splitText) {
        if (string && string.length > 0) {
          const marker = isMarker(string)
          const spell = isSpell(string)
          const color = string.substring(0, 6).toLowerCase()
          const newString = string.substring(6)

          if (marker) {
            jsonContent.push(
              createImageNode({
                editor,
                src: marker.src,
                alt: IMAGE_MARKER,
              }),
            )
          }
          else if (spell) {
            const spellId = string.replace('spell:', '').trim()
            const { icon } = await $fetch<SpellIdInformation>(`/api/spell/${spellId}`)

            toast.success(`Loading icon for spell id: ${spellId}`)

            const { src, title, alt } = createEditorSpellIdImageData(icon, spellId)
            jsonContent.push(
              createImageNode({
                editor,
                src,
                alt,
                title,
              }),
            )
          }
          else if (isValidTag(string)) {
            jsonContent.push(createTextNode(editor, `{${string}}`))
          }
          else if (newString && isHexColor(color)) {
            jsonContent.push(createTextNode(editor, newString, { color: `#${color}` }))
          }
          else {
            jsonContent.push(createTextNode(editor, string))
          }
        }
      }
    }
    else {
      jsonContent.push(item)
    }

    await createNodesOnPaste(editor, item)
  }

  if (jsonContent.length > 0) {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    content.content = Fragment.fromArray(jsonContent)
  }

  return convertSliceToHex(content)
}

export const editorExtensions = [
  StarterKit.configure({
    heading: false,
    blockquote: false,
    bold: false,
    bulletList: false,
    code: false,
    codeBlock: false,
    gapcursor: false,
    horizontalRule: false,
    italic: false,
    listItem: false,
    orderedList: false,
    strike: false,
  }),
  Image.configure({
    inline: true,
  }),
  Color,
  TextStyle,
]
export function useEditor(initialValue: Ref<string>, emit: any) {
  const editor = tiptapUseEditor({
    content: initialValue.value,
    extensions: editorExtensions,
    autofocus: 'end',
    onCreate: () => {
      emit('update:json', editor.value?.getJSON())

      if (editor.value?.getJSON()) convertJsonContentToHex(editor.value?.getJSON())
    },
    onUpdate: () => {
      emit('update:modelValue', editor.value?.getHTML())
      emit('update:json', editor.value?.getJSON())
    },
    editorProps: {
      handlePaste() {
        return true
      },
      // function exists, the types are wrong
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      transformPasted: async (pastedText: Slice) => {
        if (editor.value) {
          const content = await createNodesOnPaste(editor.value, pastedText)

          editor.value?.commands.insertContent(content.content.toJSON(), {
            parseOptions: {
              preserveWhitespace: false,
            },
          })
        }
      },
    },
  })

  watch(
    () => initialValue.value,
    value => setContent(value),
  )

  function setContent(value: string) {
    if (value === editor.value?.getHTML()) return

    editor.value?.commands.setContent(value, true, {
      preserveWhitespace: 'full',
    })
    emit('update:json', editor.value?.getJSON())
  }

  return editor
}
