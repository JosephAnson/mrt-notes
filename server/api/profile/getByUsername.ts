import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/supabase.types'

const profileColumns = 'id, username, avatar_url'

export default eventHandler(async (event) => {
  const query = getQuery<{ username: string }>(event)

  if (!query.username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username needs to be provided',
    })
  }

  const client = await serverSupabaseClient<Database>(event)

  const { data } = await client
    .from('profiles')
    .select(profileColumns)
    .eq('username', `${query.username}`)
    .single()
  return data
})
