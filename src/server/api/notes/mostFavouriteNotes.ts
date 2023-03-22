import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/supabase.types'
import type { NotesAndProfile } from '~/types'
import { NOTE_COLUMNS } from '~/utils/constants'

export interface MostFavouriteNotes {
  id: number
  count: number
  note: NotesAndProfile
}

export default cachedEventHandler(
  async (event) => {
    const client = serverSupabaseClient<Database>(event)

    const { data } = await client
      .from('favourites_count')
      .select(`id:note_id, count, note:note_id(${NOTE_COLUMNS})`)
      .order('count', { ascending: false })
      .limit(5)

    return data as MostFavouriteNotes[]
  },
  {
    maxAge: 10,
  }
)
