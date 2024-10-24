import type { Database } from '~~/app/supabase.types'
import type { Note, NotesAndProfile } from '~~/app/types'
import { serverSupabaseClient } from '#supabase/server'
import { NOTE_COLUMNS } from '~~/app/utils/constants'

import { mapNote } from '~/utils/mapNote'

export default cachedEventHandler(
  async (event): Promise<Note[]> => {
    const client = await serverSupabaseClient<Database>(event)
    const { data } = await client.from('notes').select(NOTE_COLUMNS).order('updated_at', { ascending: false }).limit(5).returns<NotesAndProfile[]>()

    return data?.map(note => mapNote(note)) || []
  },
  {
    name: 'notes-recently-modified',
    group: 'notes',
    maxAge: 60,
  },
)
