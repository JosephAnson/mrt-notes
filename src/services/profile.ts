import { useProfile } from '~/composables/state'
import type { Database } from '~/supabase.types'

const profileColumns = 'id, username, avatar_url'

export async function useAsyncGetProfile() {
  const profile = useProfile()

  const { data: asyncProfile } = await useAsyncData('profile', async () => {
    const { data } = await getProfile()
    return data
  })

  if (asyncProfile.value) {
    profile.value.id = asyncProfile.value.id
    profile.value.username = asyncProfile.value.username
    profile.value.avatar_url = asyncProfile.value.avatar_url
  }

  return profile
}

export async function getProfile() {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  if (!user.value) throw new Error('User not logged in')
  return client
    .from('profiles')
    .select(profileColumns)
    .eq('id', user.value?.id)
    .single()
}

async function usernameExists(username: String) {
  const client = useSupabaseClient<Database>()
  const { data } = await client
    .from('profiles')
    .select('username')
    .eq('username', username)

  return (data?.length || 0) > 0
}

export async function updateUsername(username: string) {
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
