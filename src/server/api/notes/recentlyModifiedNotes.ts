import { serverSupabaseClient } from '#supabase/server'
import { createNote } from '~/utils/createNote'
import type { Database } from '~/supabase.types'
import type { Note, NotesAndProfile } from '~/types'
import { NOTE_COLUMNS } from '~/utils/constants'

export default cachedEventHandler(
  async (event): Promise<Note[]> => {
    const client = serverSupabaseClient<Database>(event)
    const { data } = await client.from('notes').select(NOTE_COLUMNS).order('updated_at', { ascending: false }).limit(5)

    return (data as NotesAndProfile[]).map((note) => createNote(note))
  },
  {
    name: 'notes-recently-modified',
    group: 'notes',
    maxAge: 10,
  }
)
