import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/supabase.types'
import type { Note, NotesAndProfile } from '~/types'
import { NOTE_COLUMNS } from '~/utils/constants'
import { createNote } from '~/utils/createNote'

export default eventHandler(async (event): Promise<Note> => {
  if (!event.context.params?.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Should provide id',
    })
  }

  const id = event.context.params.id

  const client = await serverSupabaseClient<Database>(event)
  const { data } = await client.from('notes').select(NOTE_COLUMNS).match({ id }).returns<NotesAndProfile[]>().single() as { data: NotesAndProfile }

  return createNote(data)
})
