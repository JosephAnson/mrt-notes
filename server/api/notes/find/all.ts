import type { Database } from '~~/app/supabase.types'
import type { NotesAndProfile } from '~~/app/types'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
import { serverSupabaseClient } from '#supabase/server'
import { NOTE_COLUMNS } from '~~/app/utils/constants'

import { mapNote } from '~/utils/mapNote'

type NotesOrder = keyof Database['public']['Tables']['notes']['Row']

export default cachedEventHandler(
  async (event) => {
    const query = getQuery(event)

    const { order, limit } = query as { order: NotesOrder, limit: number }

    const client = await serverSupabaseClient<Database>(event)
    const { data } = await client
      .from('notes')
      .select(NOTE_COLUMNS)
      .order(order || 'created_at', { ascending: false })
      .limit(limit || 50)

    return (data as NotesAndProfile[]).map(note => mapNote(note))
  },
  {
    name: 'notes-find-all',
    group: 'notes',
    maxAge: 60,
  },
)
