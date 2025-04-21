import type { Database } from '~/supabase.types'
import type { Member, WowClassesUnion } from '~/types'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

const teamMembersColumns = 'id, name, class'

export default eventHandler(async (event) => {
  const query = await readBody<{ playerName: string, playerClass: WowClassesUnion, order: number }>(event)

  if (!query) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Should provide new members',
    })
  }

  const client = await serverSupabaseClient<Database>(event)
  const user = await serverSupabaseUser(event)

  const { data } = await client
    .from('team_members')
    .insert({
      name: query.playerName,
      class: query.playerClass,
      order: query.order,
      user_id: user?.id,
    })
    .select(teamMembersColumns)
    .returns<Member[]>()
    .single()

  return data
})
