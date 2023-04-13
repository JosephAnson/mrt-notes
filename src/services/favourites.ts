import type { Database } from '~/supabase.types'
import type { Favourite, NotesAndProfile } from '~/types'
import { NOTE_COLUMNS } from '~/utils/constants'
import { createNote } from '~/utils/createNote'

export async function getUserFavourites(userId: string | undefined): Promise<Favourite[]> {
  const client = useSupabaseClient<Database>()
  if (!userId) return []

  const { data: favourites, error } = await client
    .from('favourites')
    .select(`id, user_id, note_id, note:note_id(${NOTE_COLUMNS}), created_at`)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)

  return favourites.map((favourite) => ({
    ...favourite,
    note: createNote(favourite.note as NotesAndProfile),
  }))
}

export async function addFavourite(noteId: number, userId: string): Promise<Favourite> {
  const client = useSupabaseClient<Database>()

  const { data, error } = await client
    .from('favourites')
    .insert({ user_id: userId, note_id: noteId })
    .select('*')
    .returns<Favourite>()
    .single()

  if (error) throw new Error(error.message)

  return data
}

export async function removeFavourite(noteId: number, userId: string) {
  const client = useSupabaseClient<Database>()

  const { error, status } = await client.from('favourites').delete().match({ user_id: userId, note_id: noteId })

  if (error) throw new Error(error.message)

  return { status }
}
