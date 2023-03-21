import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/supabase.types'
import type { NotesAndProfile } from '~/types'
import { NOTE_COLUMNS } from '~/utils/constants'

export default cachedEventHandler(
  async (event): Promise<NotesAndProfile[]> => {
    const client = serverSupabaseClient<Database>(event)
    const { data } = await client.from('notes').select(NOTE_COLUMNS).order('updated_at', { ascending: false }).limit(5)

    return data as NotesAndProfile[]
  },
  {
    maxAge: 10,
  }
)
