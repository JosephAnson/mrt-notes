import type { Ref } from 'vue'
import type { Database } from '~/supabase.types'
import type { Note, NotesAndProfile, NotesRow } from '~/types'
import { createNote } from '~/utils/createNote'

const defaultEditorValue =
  'Fight summary<br><br><br>' +
  'All Phases<br><br><br>' +
  'Phase 1<br><br><br>' +
  'Phase 2<br><br><br>' +
  'Phase 3<br><br><br>'

export async function createNewNote(name: string, editor_string = defaultEditorValue) {
  if (!name && name.length <= 0) return openSnackbar('Please enter a name')

  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const router = useRouter()

  if (user.value) {
    const { data } = await client
      .from('notes')
      .insert({
        editor_string,
        name,
        user_id: user.value.id,
      })
      .select(NOTE_COLUMNS)
      .single()

    if (data) await router.push(`/note/edit/${data.id}`)
  }
}

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
  if (user.value)
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

export function setNotes(store: Ref<Note[]>, newNotes: NotesAndProfile[]) {
  store.value = newNotes.map(createNote)
}

export async function fetchAllUserNotes() {
  const user = useSupabaseUser()
  return await fetchAllNotesByUserId(user.value?.id || '')
}

export async function getAllNotes({ order, limit }: { order?: keyof NotesRow; limit?: number } = {}) {
  return await $fetch(`/api/notes/find/all`, {
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

  return data.map((note) => createNote(note))
}

export async function fetchAllNotesByUserId(user_id: String) {
  return await $fetch(`/api/notes/user/${user_id}`)
}

export async function fetchRecentlyModifiedNotes() {
  return await $fetch('/api/notes/recentlyModifiedNotes')
}

export async function fetchRecentlyCreatedNotes() {
  return await $fetch('/api/notes/recentlyCreatedNotes')
}

export async function fetchMostFavouriteNotes() {
  return await $fetch('/api/notes/mostFavouriteNotes')
}

export async function deleteNote(id: number) {
  const client = useSupabaseClient<Database>()
  await deleteGroupsWithNoteId(id)

  await client.from('notes').delete().match({ id })
  openSnackbar({ message: 'Note Deleted', background: 'bg-red-700' })
}
