import type { Database } from '~/supabase.types'
import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const query = getQuery<{ username: string }>(event)

  if (!query.username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Incorrect properties provided',
    })
  }

  const client = await serverSupabaseClient<Database>(event)
  const { data } = await client.from('profiles').select('username').eq('username', query.username)

  return (data?.length || 0) > 0
})
