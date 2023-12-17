import type { Database } from '../../../supabase.types'
import type { Note, NotesAndProfile } from '../../../types'
import { NOTE_COLUMNS } from '../../../utils/constants'
import { createNote } from '../../../utils/createNote'

import { serverSupabaseClient } from '#supabase/server'

export default cachedEventHandler(
  async (event): Promise<Note[]> => {
    const client = await serverSupabaseClient<Database>(event)
    const { data } = await client.from('notes').select(NOTE_COLUMNS).order('updated_at', { ascending: false }).limit(5).returns<NotesAndProfile[]>()

    return data?.map(note => createNote(note)) || []
  },
  {
    name: 'notes-recently-modified',
    group: 'notes',
    swr: true,
    maxAge: 10,
  },
)
