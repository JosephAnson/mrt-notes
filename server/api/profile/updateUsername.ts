import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/supabase.types'

const profileColumns = 'id, username, avatar_url'

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

  if ((data?.length || 0) > 0) {
    return false
  }

  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: 'You need to be logged in',
    })
  }

  const { data: profile, error } = await client
    .from('profiles')
    .upsert({
      username: query.username,
      id: user.id,
    })
    .select(profileColumns)
    .single()

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot update username',
    })
  }

  return profile
})
