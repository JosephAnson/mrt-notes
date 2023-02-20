import type { Database } from '~/supabase.types'
import SnackbarProgrammatic from '~/components/Programatic/SnackbarProgramatic'
import { useNotes } from '~/composables/state'
import { deleteGroupsWithNoteId } from '~/services/groups'

const noteColumns = 'id, name, editor_string'

const defaultEditorValue = 'Fight summary<br><br><br>'
    + 'All Phases<br><br><br>'
    + 'Phase 1<br><br><br>'
    + 'Phase 2<br><br><br>'
    + 'Phase 3<br><br><br>'

type NotesRow = Database['public']['Tables']['notes']['Row']

export async function createNewNote(name: string, editor_string = defaultEditorValue) {
  if (!name && name.length <= 0)
    return SnackbarProgrammatic.open('Please enter a name')

  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const router = useRouter()

  const { data } = await client.from('notes')
    .insert({
      editor_string,
      name,
      user_id: user.value?.id,
    })
    .select(noteColumns)
    .single()

  if (data)
    await router.push(`/note/${data.id}`)
}

export async function getNote(id: string) {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  return client.from('notes').select(noteColumns).match({ id }).eq('user_id', user.value?.id).single()
}

export async function updateNote(id: number, name: string, editor_string: string) {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  await client.from('notes')
    .upsert({
      editor_string,
      name,
      id,
      user_id: user.value?.id,
    })
    .select(noteColumns)
    .single()

  SnackbarProgrammatic.open('Saved')
}

export function setNotes(newNotes: Pick<NotesRow, 'id' | 'name' | 'editor_string'>[]) {
  const notes = useNotes()
  notes.value = newNotes.map(item => ({
    id: item.id,
    name: item.name,
    editor_string: item.editor_string || '',
  }))
}

export async function getAllNotes() {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  return client.from('notes').select(noteColumns).eq('user_id', user.value?.id).order('created_at')
}

export async function useAsyncDataGetAllNotes() {
  return await useAsyncData('notes', async () => {
    const { data } = await getAllNotes()
    return data
  })
}

export async function deleteNote(id: number) {
  const client = useSupabaseClient<Database>()

  await deleteGroupsWithNoteId(id)

  await client.from('notes').delete().match({ id })

  const notes = useNotes()
  notes.value = notes.value?.filter(t => t.id !== id) || []
}
