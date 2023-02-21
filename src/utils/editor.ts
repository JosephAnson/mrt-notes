import { Color } from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import TextStyle from '@tiptap/extension-text-style'
import type { Node, Slice } from '@tiptap/pm/model'
import { Fragment } from '@tiptap/pm/model'
import StarterKit from '@tiptap/starter-kit'
import type { Editor, JSONContent } from '@tiptap/vue-3'
import { useEditor as tiptapUseEditor } from '@tiptap/vue-3'
import type { Ref } from 'vue'
import { convertRgbColorsToHex } from '~/utils/convertRgbColorsToHex'

export function convertSliceToHex(text: Slice | Node) {
  text.content?.forEach((item) => {
    if (item.marks[0]?.attrs?.color) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // Value can be set, ignore type issue
      item.marks[0].attrs.color = convertRgbColorsToHex(
        item.marks[0]?.attrs?.color
      )
    }

    convertSliceToHex(item)
  })

  return text
}

export function convertJsonContentToHex(content: JSONContent) {
  content.content?.forEach((item: JSONContent) => {
    if (item.marks?.[0]?.attrs?.color) {
      item.marks[0].attrs.color = convertRgbColorsToHex(
        item.marks[0]?.attrs?.color
      )
    }

    convertJsonContentToHex(item)
  })

  return content
}

function createTextNode(
  editor: Editor,
  text: string,
  { color }: { color?: string } = {}
) {
  const marks = []

  if (color) marks.push(editor.schema.marks.textStyle.create({ color }))

  return editor.schema.text(text, marks)
}

function createImageNode(editor: Editor, src: string) {
  return editor.schema.nodes.image.create({ src })
}

function isMarker(string: String) {
  return markers.find((marker) => marker.name === string.slice(1, -1))
}

export function createNodesOnPaste(editor: Editor, content: Slice | Node) {
  const jsonContent: Node[] = []

  content.content?.forEach((item: Node) => {
    const regex =
      /({skull}|{cross}|{circle}|{star}|{square}|{triangle}|{diamond}|{moon})|\|cff([\S\w\s]+?)\|r/gim
    const splitText = item.text?.split(regex)

    if (splitText && splitText.length > 1) {
      for (const string of splitText) {
        if (string && string.length > 0) {
          const marker = isMarker(string)
          const color = string.substring(0, 6)
          const newString = string.substring(6)

          if (marker) {
            jsonContent.push(createImageNode(editor, marker.src))
          } else if (newString && isHexColor(color)) {
            jsonContent.push(
              createTextNode(editor, newString, { color: `#${color}` })
            )
          } else {
            jsonContent.push(createTextNode(editor, string))
          }
        }
      }
    } else {
      jsonContent.push(item)
    }

    createNodesOnPaste(editor, item)
  })

  if (jsonContent.length > 0) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    content.content = Fragment.fromArray(jsonContent)
  }

  return content
}

export function useEditor(initialValue: Ref<string>, emit: any) {
  const editor = tiptapUseEditor({
    content: initialValue.value,
    extensions: [
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
    ],
    autofocus: 'end',
    onCreate: () => {
      emit('update:json', editor.value?.getJSON())

      if (editor.value?.getJSON())
        convertJsonContentToHex(editor.value?.getJSON())
    },
    onUpdate: () => {
      emit('update:modelValue', editor.value?.getHTML())
      emit('update:json', editor.value?.getJSON())
    },
    editorProps: {
      // function exists, the types are wrong
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      transformPasted: (pastedText: Slice) => {
        if (editor.value) {
          const colorsCreated = createNodesOnPaste(editor.value, pastedText)

          return convertSliceToHex(colorsCreated)
        }
      },
    },
  })

  watch(
    () => initialValue.value,
    (value) => setContent(value)
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
