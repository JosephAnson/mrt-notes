import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/supabase.types'
import type { Member } from '~/types'

export default eventHandler(async (event) => {
  const member = await readBody<Member>(event)

  if (!member) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Should provide member',
    })
  }

  const client = await serverSupabaseClient<Database>(event)
  return client.from('team_members').delete().match({ id: member.id })
})
