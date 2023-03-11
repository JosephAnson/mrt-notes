import type { Database } from '~/supabase.types'
import type { Favourite } from '~/types'

export async function getUserHasFavourites(
  userId: string | undefined
): Promise<Favourite[]> {
  const client = useSupabaseClient<Database>()
  if (!userId) return []

  const { data, error } = await client
    .from('favourites')
    .select()
    .eq('user_id', userId)

  if (error) throw new Error(error.message)

  return data as Favourite[]
}

export async function addFavourite(
  noteId: number,
  userId: string
): Promise<Favourite> {
  const client = useSupabaseClient<Database>()

  const { data, error } = await client
    .from('favourites')
    .insert({ user_id: userId, note_id: noteId })
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  return data as Favourite
}

export async function removeFavourite(noteId: number, userId: string) {
  const client = useSupabaseClient<Database>()

  const { error, status } = await client
    .from('favourites')
    .delete()
    .match({ user_id: userId, note_id: noteId })

  if (error) throw new Error(error.message)

  return { status }
}
