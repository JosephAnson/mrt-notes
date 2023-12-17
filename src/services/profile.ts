import type { Database } from '~/supabase.types'
import type { Profile } from '~/types'

const profileColumns = 'id, username, avatar_url'

export async function getProfile() {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  if (!user.value?.id) return

  const { data } = await client
    .from('profiles')
    .select(profileColumns)
    .eq('id', user.value.id)
    .returns<Profile[]>()
    .single()

  return data
}

export async function getProfileByUsername(username: string) {
  const client = useSupabaseClient<Database>()
  const { data } = await client.from('profiles').select(profileColumns).ilike('username', `${username}`).single()
  return data
}

export async function usernameExists(username: string) {
  const client = useSupabaseClient<Database>()
  const { data } = await client.from('profiles').select('username').eq('username', username)

  return (data?.length || 0) > 0
}

export async function updateUsername(username: string, userId: string) {
  const client = useSupabaseClient<Database>()

  const { data, error } = await client
    .from('profiles')
    .upsert({
      username,
      id: userId,
    })
    .select(profileColumns)
    .single()

  if (error) throw new Error('Cannot update username')

  return data
}
