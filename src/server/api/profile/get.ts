import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/supabase.types'

const profileColumns = 'id, username, avatar_url'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const user = await serverSupabaseUser(event)

  if (!user?.id) return

  const { data } = await client
    .from('profiles')
    .select(profileColumns)
    .eq('id', user.id)
    .single()

  return data
})
