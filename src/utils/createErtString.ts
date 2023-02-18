import type { JSONContent } from '@tiptap/vue-3'
import type { Group } from '~/types'
import { markers } from '~/utils/config'

function convertRgbColorsToHex(string: string) {
  return string.replace(/rgb\(\d+,\s*\d+,\s*\d+\)/g,
    (rgbString) => {
      return `#${rgbString
          .match(/\b(\d+)\b/g)
          ?.map(digit =>
              parseInt(digit).toString(16).padStart(2, '0').toUpperCase(),
          )
          .join('')}`
    },
  )
}

function createParagraphContent(paragraphContent: JSONContent[]) {
  let previewString = ''

  for (const contentItem of paragraphContent) {
    if (contentItem.type === 'text') {
      if (!contentItem.marks) {
        previewString += contentItem.text
      }
      else {
        previewString += `|cff${convertRgbColorsToHex(contentItem.marks[0].attrs?.color.replace('#', ''))}${
          contentItem.text
        }|r`
      }
    }
    else if (contentItem.type === 'image') {
      const marker = markers.find(item => contentItem.attrs?.src === item.src)

      if (marker)
        previewString += `{${marker.name}}`
    }
    else if (contentItem.type === 'hardBreak') {
      previewString += '\n'
    }
  }

  return previewString
}

export function createERTString(json?: JSONContent) {
  let previewString = ''

  if (json && json.content) {
    for (const contentItem of json.content) {
      if (contentItem.content) {
        switch (contentItem.type) {
          case 'paragraph':
            previewString += `${createParagraphContent(contentItem.content)}\n`
        }
      }
    }
  }
  return previewString
}

export function createERTGroupString(group: Group) {
  const ertString = createERTString(group.note.json)
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
