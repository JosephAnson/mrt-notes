import type { Database } from '~/supabase.types'

export async function getUserHasFavourite(
  noteId: number,
  userId: string | undefined
) {
  const client = useSupabaseClient<Database>()
  if (!userId) return false

  const { data, error } = await client
    .from('favourites')
    .select()
    .match({ note_id: noteId, user_id: userId })

  if (error) throw new Error(error.message)

  return data?.length > 0
}

export async function addFavourite(noteId: number, userId: string) {
  const client = useSupabaseClient<Database>()

  const { error, status } = await client
    .from('favourites')
    .insert({ user_id: userId, note_id: noteId })

  if (error) throw new Error(error.message)

  return { status }
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

export async function handleFavourite(
  noteId: number,
  userId: string | undefined
) {
  if (!userId) return

  const userHasFavourited = await getUserHasFavourite(noteId, userId)

  if (userHasFavourited) {
    return removeFavourite(noteId, userId)
  }

  return addFavourite(noteId, userId)
}
