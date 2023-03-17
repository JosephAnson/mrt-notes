import { updateUsername, usernameExists } from '~/services/profile'
import type { Profile } from '~/types'

interface ProfileState {
  profile: Profile
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    profile: {
      id: '',
      username: null,
      avatar_url: null,
    },
  }),
  getters: {
    username: (state) => state.profile.username,
  },
  actions: {
    setProfile({ id, username, avatar_url }: Profile) {
      this.profile.id = id
      this.profile.username = username
      this.profile.avatar_url = avatar_url
    },
    async setUsername(userName?: string) {
      if (!userName) {
        openSnackbar({
          message: 'Username cannot be empty!',
          background: 'bg-red-700',
        })
      } else {
        const usernameExist = await usernameExists(userName)

        if (usernameExist) {
          openSnackbar({
            message: 'Username exists try another!',
            background: 'bg-red-700',
          })
        } else {
          const user = useSupabaseUser()
          if (!user.value) throw new Error('User not logged in')

          const data = await updateUsername(userName, user.value.id)

          this.profile.username = data.username

          openSnackbar('Saved username')
        }
      }
    },
    async fetchProfile() {
      const profile = await getProfile()
      this.setProfile(profile)
      return this.profile
    },
  },
})
