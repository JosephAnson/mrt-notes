import type { Database } from '../../../supabase.types'
import type { Note, NotesAndProfile } from '../../../types'
import { NOTE_COLUMNS } from '../../../utils/constants'
import { createNote } from '../../../utils/createNote'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { serverSupabaseClient } from '#supabase/server'

export default cachedEventHandler(
  async (event): Promise<Note[]> => {
    const client = serverSupabaseClient<Database>(event)
    const { data } = await client.from('notes').select(NOTE_COLUMNS).order('created_at', { ascending: false }).limit(5)

    return (data as NotesAndProfile[]).map((note) => createNote(note))
  },
  {
    name: 'notes-recently-created',
    group: 'notes',
    swr: true,
    maxAge: 10,
  }
)
