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

export async function signInWithOtp(email: string) {
  const client = useSupabaseAuthClient()
  const router = useRouter()

  const { error } = await client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/checkEmails`,
    },
  })

  if (error) {
    console.log(error)

    return SnackbarProgramatic.open(`Something went wrong: ${error}`)
  }
  await router.push('/checkemail')
}
