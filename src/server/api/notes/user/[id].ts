import type { Database } from '../../../../supabase.types'
import type { NotesAndProfile } from '../../../../types'
import { NOTE_COLUMNS } from '../../../../utils/constants'
import { createNote } from '../../../../utils/createNote'

import { serverSupabaseClient } from '#supabase/server'

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
