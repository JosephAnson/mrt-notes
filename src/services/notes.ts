import type { Database } from '~/supabase.types'
import type { WowClassesUnion } from '~/types'

const noteColumns = 'id, name, editor_string, editor_json'
export async function createNewNote(name: string, editor_string = '', editor_json = {}) {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const router = useRouter()

  const { data } = await client.from('notes')
    .insert({
      editor_string,
      editor_json,
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

export async function updateNote(playerName: string, playerClass: WowClassesUnion) {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  return client.from('notes')
    .upsert({
      name: playerName,
      class: playerClass,
      user_id: user.value?.id,
    })
    .select(noteColumns)
    .single()
}

export async function getAllNotes() {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  return client.from('notes').select(noteColumns).eq('user_id', user.value?.id).order('created_at')
}
