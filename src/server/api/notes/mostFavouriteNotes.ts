import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/supabase.types'
import type { Note, NotesAndProfile } from '~/types'
import { NOTE_COLUMNS } from '~/utils/constants'
import { createNote } from '~/utils/createNote'

export interface MostFavouriteNotes {
  id: number
  count: number
  note: Note
}

export default cachedEventHandler(
  async (event): Promise<MostFavouriteNotes[]> => {
    const client = serverSupabaseClient<Database>(event)

    const { data } = await client
      .from('favourites_count')
      .select(`id:note_id, count, note:note_id(${NOTE_COLUMNS})`)
      .order('count', { ascending: false })
      .limit(5)

    return data?.map((favouriteNote) => ({
      ...favouriteNote,
      note: createNote(favouriteNote.note as NotesAndProfile),
    })) as MostFavouriteNotes[]
  },
  {
    maxAge: 10,
  }
)