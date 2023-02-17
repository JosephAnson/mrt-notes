import SnackbarProgramatic from '~/components/Programatic/SnackbarProgramatic'

export const login = async (provider: 'discord' | 'google') => {
  const client = useSupabaseAuthClient()
  const router = useRouter()

  const { error } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin,
    },
  })

  if (error)
    return SnackbarProgramatic.open('Something went wrong !')

  await router.push('/')
}
