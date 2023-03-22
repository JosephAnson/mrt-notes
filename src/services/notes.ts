import type { Ref } from 'vue'
import type { MostFavouriteNotes } from '~/server/api/notes/mostFavouriteNotes'
import type { Database } from '~/supabase.types'
import type { Note, NotesAndProfile, NotesRow } from '~/types'

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

export async function getNote(id: string) {
  const client = useSupabaseClient<Database>()
  const { data } = await client.from('notes').select(NOTE_COLUMNS).match({ id }).single()
  return data as NotesAndProfile
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

export function createNotes(item: NotesAndProfile): Note {
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

export function setNotes(store: Ref<Note[]>, newNotes: NotesAndProfile[]) {
  store.value = newNotes.map(createNotes)
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
  const query = []

  if (name) query.push(`'${name}'`)

  const { data } = await client
    .from('notes')
    .select(NOTE_COLUMNS)
    .order('created_at')
    .limit(50)
    .textSearch('fts', query.join(' OR '), {
      type: 'websearch',
      config: 'english',
    })

  return data as NotesAndProfile[]
}

export async function fetchAllNotesByUserId(user_id: String): Promise<NotesAndProfile[]> {
  return await $fetch(`/api/notes/user/${user_id}`)
}

export async function fetchRecentlyModifiedNotes(): Promise<NotesAndProfile[]> {
  return await $fetch('/api/notes/recentlyModifiedNotes')
}

export async function fetchRecentlyCreatedNotes(): Promise<NotesAndProfile[]> {
  return await $fetch('/api/notes/recentlyCreatedNotes')
}

export async function fetchMostFavouriteNotes(): Promise<MostFavouriteNotes[]> {
  return await $fetch('/api/notes/mostFavouriteNotes')
}

export async function deleteNote(id: number) {
  const client = useSupabaseClient<Database>()
  await deleteGroupsWithNoteId(id)

  await client.from('notes').delete().match({ id })
  openSnackbar({ message: 'Note Deleted', background: 'bg-red-700' })
}
