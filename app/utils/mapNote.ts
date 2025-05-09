import type { Note, NotesAndProfile } from '~/types'

export function mapNote(item: NotesAndProfile): Note {
  return {
    id: item.id,
    name: item.name,
    user_id: item.user.id,
    username: item.user.username,
    description: item.description,
    created_at: item.created_at,
    updated_at: item.updated_at,
    editor_string: item.editor_string || '',
    encounter: item.encounter,
    instance: item.instance,
    expansion: item.expansion,
  }
}
