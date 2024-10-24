import { serverSupabaseClient } from '#supabase/server'
import { NOTE_COLUMNS } from '~~/app/utils/constants'
import type { Database } from '~/supabase.types'
import type { Note, NotesAndProfile } from '~/types'
import { mapNote } from '~/utils/mapNote'

export default cachedEventHandler(
  async (event): Promise<Note[]> => {
    const client = await serverSupabaseClient<Database>(event)
    const { data } = await client.from('notes').select(NOTE_COLUMNS).order('created_at', { ascending: false }).limit(5).returns<NotesAndProfile[]>()

    return data?.map(note => mapNote(note)) || []
  },
  {
    name: 'notes-recently-created',
    group: 'notes',
    maxAge: 60,
  },
)
