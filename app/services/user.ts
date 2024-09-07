import { toast } from 'vue-sonner'

export async function login(provider: 'discord' | 'google') {
  const client = useSupabaseClient()

  const { error } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/confirm`,
    },
  })

  if (error) return toast.error('Something went wrong !')
}

export async function signInWithOtp(email: string) {
  const client = useSupabaseClient()
  const router = useRouter()

  const { error } = await client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/confirm`,
    },
  })

  if (error) return toast.error(`Something went wrong: ${error}`)

  await router.push('/checkemail')
}

export function isUsersNote(userId?: string, noteId?: string) {
  if (!userId || !noteId) return false
  return userId === noteId
}
