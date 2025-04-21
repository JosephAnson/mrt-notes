import type { Database } from '~/supabase.types'
import type { Member } from '~/types'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

const teamMembersColumns = 'id, name, class'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const user = await serverSupabaseUser(event)
  if (!user?.id) return []

  const { data } = await client
    .from('team_members')
    .select(teamMembersColumns)
    .eq('user_id', user?.id)
    .order('order')
    .returns<Member[]>()

  return data
})
