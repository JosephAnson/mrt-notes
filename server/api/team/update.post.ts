import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/supabase.types'
import type { Member } from '~/types'

const teamMembersColumns = 'id, name, class'

export default eventHandler(async (event) => {
  const members = await readBody<Member[]>(event)

  if (!members) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Should provide new members',
    })
  }

  const client = await serverSupabaseClient<Database>(event)
  const user = await serverSupabaseUser(event)
  const { data } = await client
    .from('team_members')
    .upsert(
      members.map((member, index) => ({
        id: member.id,
        name: member.name,
        user_id: user?.id,
        order: index,
        class: member.class,
      })),
    )
    .returns<Member[]>()
    .select(teamMembersColumns)

  return data
})
