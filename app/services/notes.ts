import type { Ref } from 'vue'
import type { Database } from '~/supabase.types'
import type { Note, NotesAndProfile, NotesRow } from '~/types'
import { toast } from 'vue-sonner'
import { mapNote } from '~/utils/mapNote'

export async function getNote(id: string): Promise<Note | undefined> {
  const client = useSupabaseClient<Database>()
  const { data } = await client.from('notes').select(NOTE_COLUMNS).match({ id }).returns<NotesAndProfile[]>().single()

  if (!data) return
  return mapNote(data)
}

export async function createNote(name: string) {
  return await $fetch('/api/notes/create', {
    query: {
      name,
    },
  })
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
  id?: number
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
    return client
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
  store.value = newNotes.map(mapNote)
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

export async function searchAllNotes(encounterId: number) {
  const client = useSupabaseClient<Database>()

  const { data } = await client
    .from('notes')
    .select(NOTE_COLUMNS)
    .eq('encounter', encounterId) // Use encounter ID for filtering
    .order('created_at', { ascending: false })
    .limit(50)
    .returns<NotesAndProfile[]>()

  if (!data) return []

  return data.map(note => mapNote(note))
}

export async function fetchAllNotesByUserId(user_id: string) {
  return await $fetch(`/api/notes/user/${user_id}`)
}

export async function deleteNote(id: number) {
  const client = useSupabaseClient<Database>()
  await $fetch('/api/groups/removeWithNoteId', { method: 'DELETE', body: { noteId: id } })

  await client.from('notes').delete().match({ id })
  toast.success('Note has been deleted')
}
