import type { Database } from '~/supabase.types'
import type { Profile } from '~/types'

const profileColumns = 'id, username, avatar_url'

export async function useAsyncGetProfile() {
  const { data: asyncProfile } = await useAsyncData('profile', async () => await getProfile())

  if (asyncProfile.value)
    setProfile({
      id: asyncProfile.value.id,
      username: asyncProfile.value.username,
      avatar_url: asyncProfile.value.avatar_url,
    })
}

export function setProfile({ id, username, avatar_url }: Profile) {
  const profile = useProfile()
  profile.value.id = id
  profile.value.username = username
  profile.value.avatar_url = avatar_url
}

export async function getProfile() {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  const { data } = await client.from('profiles').select(profileColumns).eq('id', user.value?.id).single()

  return data
}

export async function getProfileByUsername(username: string) {
  const client = useSupabaseClient<Database>()
  const { data } = await client.from('profiles').select(profileColumns).ilike('username', `${username}`).single()
  return data
}

async function usernameExists(username: String) {
  const client = useSupabaseClient<Database>()
  const { data } = await client.from('profiles').select('username').eq('username', username)

  return (data?.length || 0) > 0
}

export async function updateUsername(username: string) {
  if (!username) {
    openSnackbar({
      message: 'Username cannot be empty!',
      background: 'bg-red-700',
    })
  } else {
    const client = useSupabaseClient<Database>()
    const user = useSupabaseUser()
    const profile = useProfile()
    const usernameExist = await usernameExists(username)

    if (usernameExist) {
      openSnackbar({
        message: 'Username exists try another!',
        background: 'bg-red-700',
      })
    } else {
      if (!user.value) throw new Error('User not logged in')
      const { error } = await client
        .from('profiles')
        .upsert({
          username,
          id: user.value.id,
        })
        .select(profileColumns)
        .single()

      if (error) throw new Error('Cannot update username')

      profile.value.username = username

      openSnackbar('Saved username')
    }
  }
}
