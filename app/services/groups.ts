import type { Database } from '~/supabase.types'
import type { Group, GroupTypeUnion } from '~/types'

const groupColumns = 'id, type, note_id, players, editor_string, order'

export async function createNewGroup({
  note_id,
  order,
  type = 'Healers',
  editor_string = '',
  players,
  user_id,
}: {
  note_id: number
  order: number
  type?: GroupTypeUnion
  editor_string?: string
  players?: string[]
  user_id: string
}) {
  const client = useSupabaseClient<Database>()

  const { data } = await client
    .from('groups')
    .insert({
      note_id,
      order,
      players,
      type,
      user_id,
      editor_string,
    })
    .select(groupColumns)
    .single()

  return data
}

export async function updateGroups(note_id: number, groups: Group[]) {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  if (user.value) {
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
          // eslint-disable-next-line ts/ban-ts-comment
          // @ts-expect-error
          user_id: user.value.id,
        })),
      )
      .select(groupColumns)

    openSnackbar('Updated groups')
  }
}

export async function getAllGroups(noteId: number) {
  const client = useSupabaseClient<Database>()
  const { data } = await client.from('groups').select(groupColumns).eq('note_id', noteId).order('order')
  return data
}

export async function deleteGroupById(id: number) {
  const client = useSupabaseClient<Database>()
  await client.from('groups').delete().match({ id })
}

export async function deleteGroupsWithNoteId(note_id: number) {
  const client = useSupabaseClient<Database>()
  await client.from('groups').delete().match({ note_id })
}
