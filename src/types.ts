import type { JSONContent } from '@tiptap/vue-3'
import type { Database } from '~/supabase.types'

export interface Profile {
  id: string
  avatar_url: string | null
  username: string | null
}

export interface Note {
  id: number
  username: string | null
  name: string
  description: string | null
  created_at: string
  updated_at: string
  editor_string: string
  user_id: string
  expansion: number | null
  instance: number | null
  encounter: number | null
  favourites_count: number
}

export type NotesAndProfile = NotesRow & { user: ProfilesRow; favourites_count: { count: number }[] }
export interface Favourite {
  id: number
  created_at: string
  user_id: string
  note_id: number
  note: Note
}

export interface EditorData {
  value: string
  json: JSONContent
}

export const GroupType = ['Healers', 'Damage Dealers', 'Tanks', 'Players'] as const
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

export type NotesRow = Database['public']['Tables']['notes']['Row']
export type ProfilesRow = Database['public']['Tables']['profiles']['Row']

export interface Node {
  id: string
  label: string
  children?: Node[]
}

export interface SpellIdInformation {
  icon: string
  tooltip: string
  name: string
}

export type NoteTypes = 'search' | 'user' | 'recentlyModified' | 'recentlyCreated' | 'mostFavourite'
