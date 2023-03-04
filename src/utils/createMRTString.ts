import type { JSONContent } from '@tiptap/vue-3'
import type { Group } from '~/types'
import { markers } from '~/utils/config'
import { IMAGE_MARKER, IMAGE_SPELLID } from '~/utils/constants'

function createParagraphContent(paragraphContent: JSONContent[]) {
  let previewString = ''

  for (const contentItem of paragraphContent) {
    if (contentItem.type === 'text') {
      if (!contentItem.marks) {
        previewString += contentItem.text
      } else {
        previewString += `|cff${contentItem.marks[0].attrs?.color?.replace(
          '#',
          ''
        )}${contentItem.text}|r`
      }
    } else if (contentItem.type === 'image') {
      if (contentItem.attrs?.alt === IMAGE_MARKER) {
        const marker = markers.find(
          (item) => contentItem.attrs?.src === item.src
        )

        if (marker) previewString += `{${marker.name}}`
      } else if (contentItem.attrs?.alt === IMAGE_SPELLID) {
        previewString += contentItem.attrs.title
      }
    } else if (contentItem.type === 'hardBreak') {
      previewString += '\n'
    }
  }

  return previewString
}

export function createPreviewString(string: string) {
  return string.replace(
    /\{time:([\S\w\s]+?)}/g,
    '<span style="color: #ffed88;">$1</span> '
  )
}

export function createMRTString(json?: JSONContent) {
  let previewString = ''

  if (json && json.content) {
    for (const contentItem of json.content) {
      if (contentItem.content) {
        switch (contentItem.type) {
          case 'paragraph':
            previewString += `${createParagraphContent(contentItem.content)}\n`
        }
      } else {
        // if the content is missing then still add new line for paragraph
        switch (contentItem.type) {
          case 'paragraph':
            previewString += `\n`
        }
      }
    }
  }
  return previewString
}

export function createMRTGroupString(group: Group) {
  const ertString = createMRTString(group.note.json)
  switch (group.type) {
    case 'Healers':
      return `{H}\n${ertString}{/H}\n`
    case 'Damage Dealers':
      return `{D}\n${ertString}{/D}\n`
    case 'Tanks':
      return `{T}\n${ertString}{/T}\n`
    case 'Players':
      return `{p:${group.players.join(',')}}\n${ertString}{/p}\n`
  }
}
