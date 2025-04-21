import type { Database } from '~/supabase.types'
import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const id = await readBody<{ id: number }>(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Should provide member',
    })
  }

  const client = await serverSupabaseClient<Database>(event)
  await client.from('groups').delete().match({ id })
})
