import type { JSONContent } from '@tiptap/vue-3'

export interface Profile {
  id: string
  avatar_url: string | null
  username: string | null
}

export interface Note {
  id: number
  name: string
  editor_string: string
  user_id: string
}

export interface EditorData {
  value: string
  json: JSONContent
}

export const GroupType = [
  'Healers',
  'Damage Dealers',
  'Tanks',
  'Players',
] as const
export type GroupTypeUnion = (typeof GroupType)[number]

export const WowClasses = [
  'Death Knight',
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
  'Evoker',
  'Demon Hunter',
] as const
export type WowClassesUnion = (typeof WowClasses)[number]

export interface Member {
  id: number
  name: string
  class: WowClassesUnion
}

export interface Group {
  id: number
  type: GroupTypeUnion
  players: string[]
  note: EditorData
}
