import type { Node, Slice } from '@tiptap/pm/model'
import type { Editor, JSONContent } from '@tiptap/vue-3'
import { useEditor as tiptapUseEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
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

function createNode(editor: Editor, text: string, color?: string) {
  const mark = editor.schema.marks.variable.create({
    color,
  })
  return editor.schema.text(text, [mark])
}
export function createColorsOnPaste(editor: Editor, content: Slice | Node) {
  const jsonContent: Node[] = []

  content.content?.forEach((item: Node) => {
    const splitText = item.text?.split(/\|cff([\S\w\s]+?)\|r/gim)

    if (splitText && splitText.length > 1) {
      for (const string of splitText) {
        const color = string.substring(0, 6)
        if (isHexColor(color))
          jsonContent.push(createNode(editor, string, color))
        else jsonContent.push(createNode(editor, string))
      }
    } else {
      jsonContent.push(item)
    }

    createColorsOnPaste(editor, item)
  })

  return jsonContent
}

export function useEditor(initialValue: Ref<string>, emit: any) {
  const editor = tiptapUseEditor({
    content: initialValue.value,
    extensions: [
      StarterKit,
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
        return convertSliceToHex(pastedText)
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
