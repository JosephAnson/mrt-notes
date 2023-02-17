import SnackbarProgramatic from '~/components/Programatic/SnackbarProgramatic'
import { useRouter, useSupabaseAuthClient } from '#imports'

export const login = async (provider: 'discord' | 'google') => {
  const client = useSupabaseAuthClient()
  const router = useRouter()

  const { error } = await client.auth.signInWithOAuth({ provider })

  if (error)
    return SnackbarProgramatic.open('Something went wrong !')

  await router.push('/')
}
