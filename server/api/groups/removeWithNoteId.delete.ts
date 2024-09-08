import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/supabase.types'

export default eventHandler(async (event) => {
  const body = await readBody<{ noteId: number }>(event)

  if (!body.noteId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Should provide member',
    })
  }

  const client = await serverSupabaseClient<Database>(event)
  await client.from('groups').delete().match({ note_id: body.noteId })
})
