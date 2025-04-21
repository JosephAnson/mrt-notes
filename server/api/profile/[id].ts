import type { Database } from '~/supabase.types'
import { serverSupabaseClient } from '#supabase/server'

const profileColumns = 'id, username, avatar_url'

export default eventHandler(async (event) => {
  if (!event.context.params?.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Should provide id',
    })
  }

  const id = event.context.params.id

  const client = await serverSupabaseClient<Database>(event)

  const { data } = await client
    .from('profiles')
    .select(profileColumns)
    .eq('id', id)
    .single()

  return data
})
