import type { PostgrestSingleResponse } from '@supabase/postgrest-js'
import type { Ref } from 'vue'
import type { Database } from '~/supabase.types'
import type { Note, NotesAndProfile, NotesRow } from '~/types'

const noteColumns =
  'id, name, description, editor_string, user_id ( id, username ), created_at, updated_at, categories'

const defaultEditorValue =
  'Fight summary<br><br><br>' +
  'All Phases<br><br><br>' +
  'Phase 1<br><br><br>' +
  'Phase 2<br><br><br>' +
  'Phase 3<br><br><br>'

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

export function createNotes(item: NotesAndProfile): Note {
  return {
    id: item.id,
    name: item.name,
    user_id: item.user_id.id,
    username: item.user_id.username,
    description: item.description,
    created_at: item.created_at,
    updated_at: item.updated_at,
    editor_string: item.editor_string || '',
  }
}

export function setNotes(store: Ref<Note[]>, newNotes: NotesAndProfile[]) {
  store.value = newNotes.map(createNotes)
}

export async function fetchAllUserNotes() {
  const user = useSupabaseUser()
  return await fetchAllNotesByUserId(user.value?.id || '')
}

export async function getAllNotes({
  order,
  limit,
}: { order?: keyof NotesRow; limit?: number } = {}) {
  const client = useSupabaseClient<Database>()
  const { data } = await client
    .from('notes')
    .select(noteColumns)
    .order(order || 'created_at', { ascending: false })
    .limit(limit || 50)

  return data as NotesAndProfile[]
}

export async function searchAllNotes(
  name: string,
  categories: string[] | null
) {
  const client = useSupabaseClient<Database>()
  const query = []

  if (name) query.push(`'${name}'`)

  if (categories && categories.length) {
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i]
      const sections = category.split('/')
      sections.pop()
      if (sections) query.push(sections.join('/'))

      query.push(category)
    }
  }

  const { data } = await client
    .from('notes')
    .select(noteColumns)
    .order('created_at')
    .containedBy('categories', categories || '')
    .limit(50)
    .textSearch('fts', query.join(' OR '), {
      type: 'websearch',
      config: 'english',
    })

  return data as NotesAndProfile[]
}

export async function fetchAllNotesByUserId(
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
  await deleteGroupsWithNoteId(id)

  await client.from('notes').delete().match({ id })
  openSnackbar({ message: 'Note Deleted', background: 'bg-red-700' })
}
