import type { Database } from '~/supabase.types'
import type { Group, GroupTypeUnion } from '~/types'
import { serverSupabaseClient } from '#supabase/server'
import { generateJSON } from '@tiptap/html'
import { editorExtensions } from '~/utils/editor'

const groupColumns = 'id, type, note_id, players, editor_string, order'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const body = await getQuery<{ noteId: number }>(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Should provide new members',
    })
  }

  const { data } = await client.from('groups').select(groupColumns).eq('note_id', body.noteId).order('order')

  return (data?.map((item, index) => ({
    id: item.id,
    note: { value: item.editor_string || '', json: generateJSON(item.editor_string || '', editorExtensions) },
    order: index,
    type: (item.type as GroupTypeUnion) || 'Players',
    players: item.players || [],
  })) || []) as Group[]
})
