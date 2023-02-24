import type { PostgrestSingleResponse } from '@supabase/postgrest-js'
import type { Database } from '~/supabase.types'
import type { NotesRow, ProfilesRow } from '~/types'

const noteColumns =
  'id, name, description, editor_string, user_id ( id, username ), created_at, categories'

const defaultEditorValue =
  'Fight summary<br><br><br>' +
  'All Phases<br><br><br>' +
  'Phase 1<br><br><br>' +
  'Phase 2<br><br><br>' +
  'Phase 3<br><br><br>'

type NotesAndProfile = NotesRow & { user_id: ProfilesRow }

export async function createNewNote(
  name: string,
  editor_string = defaultEditorValue
) {
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
      .select(noteColumns)
      .single()

    if (data) await router.push(`/note/edit/${data.id}`)
  }
}

export async function getNote(
  id: string
): Promise<PostgrestSingleResponse<NotesAndProfile>> {
  const client = useSupabaseClient<Database>()
  return client.from('notes').select(noteColumns).match({ id }).single()
}

export async function updateNote({
  id,
  name,
  description,
  editor_string,
  categories,
}: {
  id: number
  name: string
  description: string
  editor_string: string
  categories: string[]
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
        categories,
        user_id: user.value.id,
      })
      .select(noteColumns)
      .single()

  openSnackbar('Saved')
}

export function setNotes(newNotes: NotesAndProfile[]) {
  const notes = useNotes()
  notes.value = newNotes.map((item) => ({
    id: item.id,
    name: item.name,
    user_id: item.user_id.id,
    username: item.user_id.username,
    description: item.description,
    created_at: item.created_at,
    editor_string: item.editor_string || '',
  }))
}

export async function getAllNotes() {
  const user = useSupabaseUser()
  return getAllNotesByUserId(user.value?.id || '')
}

export async function getAllNotesByUserId(
  user_id: String
): Promise<NotesAndProfile[]> {
  const client = useSupabaseClient<Database>()
  const { data } = await client
    .from('notes')
    .select(noteColumns)
    .eq('user_id', user_id)
    .order('created_at')

  return data as NotesAndProfile[]
}

export async function deleteNote(id: number) {
  const client = useSupabaseClient<Database>()
  const notes = useNotes()

  await deleteGroupsWithNoteId(id)

  await client.from('notes').delete().match({ id })

  notes.value = notes.value?.filter((t) => t.id !== id) || []
  openSnackbar({ message: 'Note Deleted', background: 'bg-red-700' })
}
