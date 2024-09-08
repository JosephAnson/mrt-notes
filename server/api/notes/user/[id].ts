import { serverSupabaseClient } from '#supabase/server'
import { NOTE_COLUMNS } from '~~/app/utils/constants'
import { createNote } from '~~/app/utils/createNote'
import type { Database } from '~~/app/supabase.types'

import type { NotesAndProfile } from '~~/app/types'

export default eventHandler(async (event) => {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Should provide id',
    })
  }

  const client = await serverSupabaseClient<Database>(event)
  const { data } = await client
    .from('notes')
    .select(NOTE_COLUMNS)
    .eq('user_id', event.context.params.id)
    .order('created_at')
    .returns<NotesAndProfile[]>()

  return data?.map(note => createNote(note))
})
