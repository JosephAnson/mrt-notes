import type { Database } from '~/supabase.types'
import SnackbarProgrammatic from '~/components/Programatic/SnackbarProgramatic'
import { useGroups } from '~/composables/state'
import type { Group, GroupTypeUnion } from '~/types'

const groupColumns = 'id, type, note_id, players, editor_string, order'

export function setGroups(newGroups: Group[]) {
  const groups = useGroups()
  groups.value = newGroups
}

export async function createNewGroup(
  note_id: number,
  order: number,
  type: GroupTypeUnion = 'Healers',
  editor_string = '',
  players?: string[]
) {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const groups = useGroups()

  const { data } = await client
    .from('groups')
    .insert({
      note_id,
      order: groups.value.length + 1,
      players,
      type,
      user_id: user.value?.id,
      editor_string,
    })
    .select(groupColumns)
    .single()

  if (data) {
    groups.value?.push({
      id: data.id,
      note: { value: data.editor_string || '', json: {} },
      type: (data.type as GroupTypeUnion) || 'Players',
      players: data.players || [],
    })
  }
}

export async function updateGroups(note_id: number, groups: Group[]) {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  await client
    .from('groups')
    .upsert(
      groups.map((group, index) => ({
        editor_string: group.note.value,
        id: group.id,
        note_id,
        order: index,
        players: group.players,
        type: group.type,
        user_id: user.value?.id,
      }))
    )
    .select(groupColumns)

  SnackbarProgrammatic.open('Saved')
}

export async function getAllGroups(noteId: number | string) {
  const client = useSupabaseClient<Database>()
  return client
    .from('groups')
    .select(groupColumns)
    .eq('note_id', noteId)
    .order('order')
}

export async function deleteGroup(id: number) {
  const client = useSupabaseClient<Database>()
  await client.from('groups').delete().match({ id })

  const groups = useGroups()
  groups.value = groups.value?.filter((t) => t.id !== id) || []
}

export async function deleteGroupsWithNoteId(note_id: number) {
  const client = useSupabaseClient<Database>()
  await client.from('groups').delete().match({ note_id })
}
