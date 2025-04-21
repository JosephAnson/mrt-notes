import type { Database } from '~/supabase.types'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { NOTE_COLUMNS } from '~~/app/utils/constants'

const defaultEditorValue
  = 'Fight summary<br><br><br>'
    + 'All Phases<br><br><br>'
    + 'Phase 1<br><br><br>'
    + 'Phase 2<br><br><br>'
    + 'Phase 3<br><br><br>'

export default eventHandler(async (event) => {
  const query = getQuery<{ name: string }>(event)

  if (!query) throw new Error('No body found')
  if (!query?.name) throw new Error('No name found')

  const { name } = query

  const client = await serverSupabaseClient<Database>(event)
  const user = await serverSupabaseUser(event)

  if (user) {
    return await client
      .from('notes')
      .insert({
        editor_string: defaultEditorValue,
        name,
        user_id: user.id,
      })
      .select(NOTE_COLUMNS)
      .single()
  }
})
