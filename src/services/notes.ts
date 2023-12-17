import type { Ref } from 'vue'
import type { Database } from '~/supabase.types'
import type { Note, NotesAndProfile, NotesRow } from '~/types'
import { createNote } from '~/utils/createNote'

export async function getNote(id: string): Promise<Note | undefined> {
  const client = useSupabaseClient<Database>()
  const { data } = await client.from('notes').select(NOTE_COLUMNS).match({ id }).returns<NotesAndProfile[]>().single()

  if (!data) return
  return createNote(data)
}

export async function updateNote({
  id,
  name,
  description,
  editor_string,
  expansion,
  encounter,
  instance,
}: {
  id: number
  name: string
  description: string
  editor_string: string
  expansion: number
  instance: number
  encounter: number
}) {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  if (user.value) {
    await client
      .from('notes')
      .upsert({
        editor_string,
        name,
        id,
        description,
        expansion,
        instance,
        encounter,
        user_id: user.value.id,
      })
      .select(NOTE_COLUMNS)
      .single()
  }
}

export function setNotes(store: Ref<Note[]>, newNotes: NotesAndProfile[]) {
  store.value = newNotes.map(createNote)
}

export async function fetchAllUserNotes() {
  const user = useSupabaseUser()
  return await fetchAllNotesByUserId(user.value?.id || '')
}

export async function getAllNotes({ order, limit }: { order?: keyof NotesRow, limit?: number } = {}) {
  return await $fetch('/api/notes/find/all', {
    query: {
      limit,
      order,
    },
  })
}

export async function searchAllNotes(name: string) {
  const client = useSupabaseClient<Database>()
  const query = name.split(' ').join(' OR ')

  const { data } = await client
    .from('notes')
    .select(NOTE_COLUMNS)
    .order('created_at')
    .limit(50)
    .textSearch('fts', query, {
      type: 'websearch',
      config: 'english',
    })
    .returns<NotesAndProfile[]>()

  if (!data) return []

  return data.map(note => createNote(note))
}

export async function fetchAllNotesByUserId(user_id: string) {
  return await $fetch(`/api/notes/user/${user_id}`)
}

export async function deleteNote(id: number) {
  const client = useSupabaseClient<Database>()
  await deleteGroupsWithNoteId(id)

  await client.from('notes').delete().match({ id })
  openSnackbar({ message: 'Note Deleted', background: 'bg-red-700' })
}
