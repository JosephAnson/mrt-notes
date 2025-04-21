import type { Database } from '~/supabase.types'
import type { GroupTypeUnion } from '~/types'
import { serverSupabaseClient } from '#supabase/server'

const groupColumns = 'id, type, note_id, players, editor_string, order'

export default eventHandler(async (event) => {
  const query = await readBody<{
    note_id: number
    order: number
    type?: GroupTypeUnion
    editor_string?: string
    players?: string[]
    user_id: string
  }>(event)

  if (!query) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Should provide new members',
    })
  }

  const client = await serverSupabaseClient<Database>(event)

  const { data } = await client
    .from('groups')
    .insert({
      ...query,
    })
    .select(groupColumns)
    .single()

  return data
})
