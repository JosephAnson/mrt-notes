import type { Database } from '../../../../supabase.types'
import type { NotesAndProfile } from '../../../../types'
import { NOTE_COLUMNS } from '../../../../utils/constants'
import { createNote } from '../../../../utils/createNote'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { serverSupabaseClient } from '#supabase/server'

type NotesOrder = keyof Database['public']['Tables']['notes']['Row']

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
    name: 'notes-find-all',
    group: 'notes',
    maxAge: 60,
  }
)
