import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/supabase.types'
import type { Group } from '~/types'

const groupColumns = 'id, type, note_id, players, editor_string, order'

export default eventHandler(async (event) => {
  const body = await readBody<{ noteId: number, groups: Group[] }>(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Should provide new members',
    })
  }

  const client = await serverSupabaseClient<Database>(event)
  const user = await serverSupabaseUser(event)

  if (!user?.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'no user provided',
    })
  }

  const { data } = await client
    .from('groups')
    .upsert(
      body.groups.map((group, index) => ({
        editor_string: group.note.value,
        id: group.id,
        note_id: body.noteId,
        order: index,
        players: group.players,
        type: group.type,
        user_id: user.id,
      })),
    )
    .select(groupColumns)

  return data
})
