import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/supabase.types'
import type { NotesAndProfile, NotesRow } from '~/types'
import { NOTE_COLUMNS } from '~/utils/constants'
import { createNote } from '~/utils/createNote'

type NotesOrder = keyof NotesRow

export default cachedEventHandler(
  async (event) => {
    const query = getQuery(event)

    const { order, limit } = query as { order: NotesOrder; limit: number }

    const client = serverSupabaseClient<Database>(event)
    const { data } = await client
      .from('notes')
      .select(NOTE_COLUMNS)
      .order(order || 'created_at', { ascending: false })
      .limit(limit || 50)

    return (data as NotesAndProfile[]).map((note) => createNote(note))
  },
  {
    maxAge: 60,
  }
)
