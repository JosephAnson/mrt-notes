import type { JSONContent } from '@tiptap/vue-3'
import type { Guid } from '~/utils/guid'

export type TemplateOption = 'Default' | 'Empty'

export interface Editor {
  value: string
  json: JSONContent
}

export const GroupType = [
  'Healers',
  'Damage Dealers',
  'Tanks',
  'Players'] as const
export type GroupTypeUnion = typeof GroupType[number]

export const WowClasses = ['Death Knight',
  'Druid',
  'Hunter',
  'Mage',
  'Paladin',
  'Monk',
  'Rogue',
  'Priest',
  'Shaman',
  'Warlock',
  'Warrior',
  'Demon Hunter'] as const
export type WowClassesUnion = typeof WowClasses[number]

export interface Player {
  id: Guid
  name: string
  class: WowClassesUnion
}

export interface Group {
  id: Guid
  type: GroupTypeUnion
  players: string[]
  editor: Editor
}

export interface SaveDataDTO {
  editor: Editor
  groups: Group[]
  players: Player[]
}
